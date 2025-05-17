"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from "@/types/canvas"

import { CursorsPresence } from "./cursors-presence"
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useSelf, useStorage } from "@/liveblocks.config"
import { colorToCss, connectionIdToColor, findIntersectingLayersWithRectangle, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils"
import { nanoid } from "nanoid"
import { LiveObject } from "@liveblocks/client"
import { LayerPreview } from "./layer-preview"
import { SelectionBox } from "./selection-box"
import { SelectionTools } from "./selection-tools"
import { Path } from "./path"
import { useDeleteLayers } from "@/hooks/use-delete-layers"
import { DownloadButton } from "@/lib/download"
import { Download, X } from 'lucide-react';

const MAX_LAYER = 100;
interface CanvasProps {
    boardId: string;
}
export const Canvas = ({
    boardId,
}: CanvasProps) => {

    const layerIds = useStorage((root) => root.layerIds)!;

    const pencilDraft = useSelf((me) => me.presence.pencilDraft);

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None
    });

    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 255,
        g: 0,
        b: 0
    })


    const history = useHistory();
    const canRedo = useCanRedo();
    const canUndo = useCanUndo();
        const [isMenuOpen, setIsMenuOpen] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const insertLayer = useMutation((
        { storage, setMyPresence },
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
        position: Point
    ) => {
        const liveLayers = storage.get("layers");
        if (liveLayers.size >= MAX_LAYER) {
            return;
        }
        const liveLayersIds = storage.get("layerIds");
        const layerId = nanoid();
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill: lastUsedColor,
        })

        liveLayersIds.push(layerId);
        liveLayers.set(layerId, layer);

        setMyPresence({
            selection: [layerId]
        },
            {
                addToHistory: true
            })
        setCanvasState({ mode: CanvasMode.None });

    }, [lastUsedColor])

    const translateSelectedLayers = useMutation((
        { storage, self },
        point: Point,
    ) => {
        if (canvasState.mode !== CanvasMode.Translating) {
            return;
        }
        const offset = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y
        }

        const livelayers = storage.get("layers");

        for (const id of self.presence.selection) {
            const layer = livelayers.get(id);

            if (layer) {
                layer.update({
                    x: layer.get("x") + offset.x,
                    y: layer.get("y") + offset.y,
                });
            }
        }
        setCanvasState({ mode: CanvasMode.Translating, current: point });
    }, [canvasState])

    const unselectLayers = useMutation((
        { self, setMyPresence }
    ) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true });
        }
    }, []);

    const updateSelectionNet = useMutation((
        { storage, setMyPresence },
        current: Point,
        origin: Point,
    ) => {
        const layers = storage.get("layers").toImmutable();
        setCanvasState({
            mode: CanvasMode.SelectionNet,
            origin,
            current,
        })
        const ids = findIntersectingLayersWithRectangle(
            layerIds,
            layers,
            origin,
            current
        );

        setMyPresence({ selection: ids });
    }, [layerIds])

    const startMultiSelection = useCallback((
        current: Point,
        origin: Point
    ) => {
        if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin,
                current,
            });
        }
    }, [])

    const continueDrawing = useMutation((
        { self, setMyPresence },
        point: Point,
        e: React.PointerEvent,
    ) => {
        const { pencilDraft } = self.presence;

        if (canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || pencilDraft == null) {
            return;
        }

        setMyPresence({
            cursor: point,
            pencilDraft:
                pencilDraft.length === 1 &&
                    pencilDraft[0][0] === point.x &&
                    pencilDraft[0][1] === point.y
                    ? pencilDraft
                    : [...pencilDraft, [point.x, point.y, e.pressure]]
        })
    }, [canvasState.mode])

    const insertPath = useMutation((
        { storage, self, setMyPresence }
    ) => {
        const liveLayers = storage.get("layers");
        const { pencilDraft } = self.presence;

        if (
            pencilDraft == null ||
            pencilDraft.length < 2 ||
            liveLayers.size >= MAX_LAYER
        ) {
            setMyPresence({ pencilDraft: null });
            return;
        }
        const id = nanoid();
        liveLayers.set(
            id,
            new LiveObject(penPointsToPathLayer(
                pencilDraft,
                lastUsedColor,
            )),
        );

        const liveLayersIds = storage.get("layerIds");
        liveLayersIds.push(id);

        setMyPresence({ pencilDraft: null });
        setCanvasState({ mode: CanvasMode.Pencil });
    }, [lastUsedColor])

    const startDrawing = useMutation((
        { setMyPresence },
        point: Point,
        presence: number,
    ) => {
        setMyPresence({
            pencilDraft: [[point.x, point.y, presence]],
            penColor: lastUsedColor,
        })
    }, [lastUsedColor])

    const resizeSelectedLayer = useMutation((
        { storage, self },
        point: Point
    ) => {
        if (canvasState.mode !== CanvasMode.Resizing) {
            return;
        }

        const bounds = resizeBounds(
            canvasState.initialBounds,
            canvasState.corner,
            point,
        );

        const livelayers = storage.get("layers");
        const layer = livelayers.get(self.presence.selection[0]);

        if (layer) {
            layer.update(bounds);
        };

    }, [canvasState])


    const onResizeHandlePointerDown = useCallback((
        corner: Side,
        initialBounds: XYWH,
    ) => {

        history.pause();
        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds,
            corner,
        });

    }, [history])

    const onWheel = useCallback((e: React.WheelEvent) => {

        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }));
    }, []);

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault()


        const current = pointerEventToCanvasPoint(e, camera);
        if (canvasState.mode === CanvasMode.Pressing) {
            startMultiSelection(current, canvasState.origin);
        }

        else if (canvasState.mode === CanvasMode.SelectionNet) {
            updateSelectionNet(current, canvasState.origin);
        }

        else if (canvasState.mode === CanvasMode.Translating) {
            translateSelectedLayers(current);
        }

        else if (canvasState.mode === CanvasMode.Resizing) {
            resizeSelectedLayer(current);
        }

        else if (canvasState.mode == CanvasMode.Pencil) {
            continueDrawing(current, e);
        }

        setMyPresence({ cursor: current });
    }, [
        canvasState,
        resizeSelectedLayer,
        camera, ,
        translateSelectedLayers
    ])

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, [])

    const onPointerDown = useCallback((
        e: React.PointerEvent,
    ) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Inserting) {
            return;
        }

        if (canvasState.mode == CanvasMode.Pencil) {
            startDrawing(point, e.pressure);
            return;
        }

        setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    }, [
        camera,
        canvasState.mode,
        setCanvasState,
        startDrawing
    ])


    const onPointerUp = useMutation((
        { },
        e) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Pressing
        ) {
            unselectLayers();
            setCanvasState({
                mode: CanvasMode.None,
            })
        }

        else if (canvasState.mode === CanvasMode.Pencil) {
            insertPath();
        }

        else if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point);
        }
        else {
            setCanvasState({
                mode: CanvasMode.None,
            });
        }
        history.resume();
    }, [
        camera,
        canvasState,
        history,
        insertLayer,
        unselectLayers,
        insertPath,
        setCanvasState,
    ]
    );
    const selections = useOthersMapped((other) => other.presence.selection);

    const onLayerPointerDown = useMutation((
        { self, setMyPresence },
        e: React.PointerEvent,
        layerId: string,
    ) => {
        if (canvasState.mode === CanvasMode.Pencil ||
            canvasState.mode === CanvasMode.Inserting
        ) {
            return;
        }
        history.pause();
        e.stopPropagation();

        const point = pointerEventToCanvasPoint(e, camera);

        if (!self.presence.selection.includes(layerId)) {
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point });
    }, [
        setCanvasState,
        camera,
        history,
        canvasState.mode,
    ])


    const deleteLayer = useDeleteLayers();

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            switch (e.key) {
                case "z": {
                    if (e.ctrlKey || e.metaKey) {
                        history.undo();
                        break;
                    }
                }
                case "y": {
                    if (e.ctrlKey || e.metaKey) {
                        history.redo();
                        break;
                    }
                }
            }
        }
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [deleteLayer, history])

    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};
        for (const user of selections) {
            const [connectionId, selection] = user;

            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
            }
        }

        return layerIdsToColorSelection;
    }, [selections])



    return (
        <main className="absolute bg-amber-100 h-full w-full">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={canRedo}
                canUndo={canUndo}
                undo={history.undo}
                redo={history.redo}
            />
            <SelectionTools
                camera={camera}
                setLastUsedColor={setLastUsedColor}
            />
            <svg
             ref={svgRef}
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}
            >
                {/* Define patterns for the grid */}
                <defs>
                    {/* Minor grid pattern */}
                    <pattern
                        id="minorGrid"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="var(--color-border)"
                            strokeWidth="0.3"
                            opacity="0.8"
                        />
                    </pattern>
                    {/* Major grid pattern */}
                    <pattern
                        id="majorGrid"
                        width="100"
                        height="100"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect
                            width="100"
                            height="100"
                            fill="url(#minorGrid)"
                        />
                        <path
                            d="M 100 0 L 0 0 0 100"
                            fill="none"
                            stroke="var(--color-border)"
                            strokeWidth="2"
                        />
                    </pattern>
                </defs>
                {/* Background rectangle with grid */}
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#majorGrid)"
                    stroke="var(--color-border)"

                />
                <g
                    style={{
                        transform: `translate(${camera.x}px,${camera.y}px)`
                    }}
                >
                    {layerIds?.map((layerId) => (
                        <LayerPreview
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColorSelection[layerId]}
                        />
                    ))}
                    <SelectionBox
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                    {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
                        <rect className="fill-blue-500/5 stroke-blue-400 stroke-1"
                            x={Math.min(canvasState.origin.x, canvasState.current.x)}
                            y={Math.min(canvasState.origin.y, canvasState.current.y)}
                            width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                            height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                        />
                    )}
                    <CursorsPresence />
                    {pencilDraft != null && pencilDraft.length > 0 && (
                        <Path
                            points={pencilDraft}
                            fill={colorToCss(lastUsedColor)}
                            x={0}
                            y={0}
                        />
                    )}
                </g>
            </svg>
              {/* Download buttons */}
  <div className="fixed bottom-4 right-4 z-50">

                {/* Mobile menu button */}

                <button

                    onClick={() => setIsMenuOpen(!isMenuOpen)}

                    className="md:hidden bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 transition-all duration-200"

                >

                    {isMenuOpen ? (

                        <X className="h-6 w-6" />

                    ) : (

                        <Download className="h-6 w-6" />

                    )}

                </button>


                {/* Mobile menu */}

                {isMenuOpen && (

                    <div className="absolute bottom-16 right-0 md:hidden bg-background rounded-lg shadow-xl border border-border p-2 w-48 animate-in slide-in-from-bottom">

                        <div className="space-y-2">

                            {['svg', 'png', 'json'].map((format) => (

                                <DownloadButton

                                    key={format}

                                    svgRef={svgRef}

                                    format={format as 'svg' | 'png' | 'json'}

                                    className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"

                                    fileName="canvas-drawing"

                                >

                                    <div className="flex items-center gap-2">

                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />

                                        </svg>

                                        Download {format.toUpperCase()}

                                    </div>

                                </DownloadButton>

                            ))}

                        </div>

                    </div>

                )}


                {/* Desktop buttons */}

                <div className="hidden md:flex gap-2">

                    {['svg', 'png', 'json'].map((format) => (

                        <DownloadButton

                            key={format}

                            svgRef={svgRef}

                            format={format as 'svg' | 'png' | 'json'}

                            className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors duration-200 shadow-lg flex items-center gap-2"

                            fileName="canvas-drawing"

                        >

                            <div className="flex items-center gap-2">

                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />

                                </svg>

                                {format.toUpperCase()}

                            </div>

                        </DownloadButton>

                    ))}

                </div>

            </div>


            {/* Backdrop */}

            {isMenuOpen && (

                <div 

                    className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"

                    onClick={() => setIsMenuOpen(false)}

                />

            )}

        </main>

    )
}