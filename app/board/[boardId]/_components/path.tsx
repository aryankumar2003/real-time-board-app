import getStroke from "perfect-freehand";
import React from "react";

interface PathProps {
    x: number;
    y: number;
    points: number[][];
    fill: string;
    onPointerDown?: (e: React.PointerEvent) => void;
    stroke?: string;
}


function getSvgPathFromStroke(points: number[][]): string {
    if (!points.length) return "";
    const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
    return d + " Z";
}

export const Path = ({
    x,
    y,
    points,
    fill,
    onPointerDown,
    stroke,
}: PathProps) => {
    const strokePoints = getStroke(points);
    const d = getSvgPathFromStroke(strokePoints);

    return (
        <path
            className="drop-shadow-md"
            fill={fill}
            d={getSvgPathFromStroke(
                getStroke(points, {
                    size: 16,
                    thinning: 0.5,
                    smoothing: 0.5,
                    streamline: 0.5,
                })
            )}
            onPointerDown={onPointerDown}
            style={{
                transform: `translate(${x}px, ${y}px)`
            }}
            strokeWidth={1}
        />
    );
};
