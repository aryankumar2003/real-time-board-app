import { Camera, Color, Point, Side, XYWH } from "@/types/canvas";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const COLORS = [
  "#FF5733",       // Bright red-orange
  "#33FF57",       // Bright green
  "#3357FF",       // Bright blue
  "rgb(255, 99, 71)",   // Tomato
  "rgb(60, 179, 113)",  // Medium sea green
  "rgb(123, 104, 238)", // Medium slate blue
  "hsl(0, 100%, 50%)",  // Red
  "hsl(120, 100%, 40%)",// Green
  "hsl(240, 100%, 60%)",// Blue
  "hsl(45, 100%, 50%)", // Yellow
  "orange",
  "turquoise",
  "goldenrod",
  "teal",
  "indigo",
  "salmon",
  "crimson",
  "chocolate",
  "slateblue",
  "mediumvioletred"
];



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function connectionIdToColor(connectionId:number):string{
  return COLORS[connectionId % COLORS.length];
}


export function pointerEventToCanvasPoint(
  e:React.PointerEvent,
  camera:Camera, 
){
  return{
    x:Math.round(e.clientX-camera.x),
    y:Math.round(e.clientY-camera.y)
  };
};


export function colorToCss(color:Color){
  return `#${color.r.toString(16).padStart(2,"0")}
  ${color.g.toString(16).padStart(2,"0")}${color.b.toString(16).padStart(2,"0")}`;
}

export function resizeBounds(
  bounds:XYWH,
  corner:Side,
  point:Point

):XYWH{
  const result={
    x:bounds.x,
    y:bounds.y,
    width:bounds.width,
    height:bounds.height,
  };
  if((corner && Side.Left)=== Side.Left){
    result.x=Math.min(point.x,bounds.x +bounds.width);
    result.width=Math.abs(bounds.x +bounds.width -point.x);
  }
  if((corner && Side.Right)=== Side.Right){
    result.x=Math.min(point.x,bounds.x);
    result.width=Math.abs(point.x-bounds.x);
  }
  if((corner && Side.Top)===Side.Top){
    result.y=Math.min(point.y,bounds.y+bounds.height);
    result.height=Math.abs(bounds.y +bounds.height -point.y);
  }
  if((corner && Side.Bottom)===Side.Bottom){
    result.y=Math.min(point.y, bounds.y);
    result.height=Math.abs(point.y-bounds.y);
  }
  return result
}