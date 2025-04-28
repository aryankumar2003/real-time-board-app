"use client";

import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";

interface ColorPickerProps{
    onChange:(color:Color)=>void;
};

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
    const colors: Color[] = [
        { r: 243, g: 0, b: 0 },     // Red
        { r: 0, g: 243, b: 0 },     // Green
        { r: 0, g: 0, b: 243 },     // Blue
        { r: 255, g: 255, b: 0 },   // Yellow
        { r: 255, g: 165, b: 0 },   // Orange
        { r: 128, g: 0, b: 128 },   // Purple
        { r: 0, g: 255, b: 255 },   // Cyan
        { r: 255, g: 192, b: 203 }, // Pink
      ];
    return (
      <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-300">
        {colors.map((color, index) => (
        <ColorButton
          key={index}
          onClick={onChange}
          color={color}
        />
      ))}
      </div>
    );
  };

interface ColorButtonProps{
    onClick:(color:Color)=>void;
    color:Color;
};
const ColorButton=({
    onClick,
    color,
}:ColorButtonProps)=>{
    return(
        <button 
        className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
        onClick={()=>onClick(color)}
        >
            <div className="h-8 w-8 rounded-md border border-neutral-400"
            style={{ background: colorToCss(color) }}
        />


            
        </button>
    )
}