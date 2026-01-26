// src/app/projects/create/components/TagManager.tsx
import { useState, useEffect } from "react";
import { Box, Button, CircularProgress, createFilterOptions } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Tag } from "@/src/types/tag";
import { TagRow } from "@/src/types/tag";
import { TagItem } from "./TagItem";


const getTextWidth = (text: string, font: string = "16px 'IBM Plex Sans Thai', sans-serif") => {
  if (typeof window === "undefined") return 150; // ค่าเริ่มต้น
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 120;
  context.font = font;
  const metrics = context.measureText(text || "Remove this tag"); 
  const minMetrics = context.measureText("Remove this tag"); 
  if (metrics.width < minMetrics.width){
    return Math.max(120, minMetrics.width + 70); 
  }
  // + 70px เผื่อ Padding ซ้ายขวา + Icon + Cursor
  return Math.max(120, metrics.width + 70); 
};

interface TagManagerProps {
  tagRows: TagRow[]; 
  availableTags: Tag[];
  fetchingTags: boolean;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onTagChange: (index: number, val: any) => void;
  onDeleteTagFromDb: (tag: Tag) => void;
  onDropdownOpen: () => void;
}

export const TagManager = ({
  tagRows, // รับค่า tagRows แทน
  availableTags,
  fetchingTags,
  onAddRow,
  onRemoveRow,
  onTagChange,
  onDeleteTagFromDb,
  onDropdownOpen
}: TagManagerProps) => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="pb-8">
      <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Tags</div>

      {fetchingTags && availableTags.length === 0 ? (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: '#888' }}>
          <CircularProgress size={20} /> Loading tags...
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
          
          {tagRows.map((row, index) => (
            <TagItem 
              key={row.id}
              row={row}
              index={index}
              availableTags={availableTags}
              onDropdownOpen={onDropdownOpen}
              onRemoveRow={onRemoveRow}
              onTagChange={onTagChange}
              onDeleteTagFromDb={onDeleteTagFromDb}
            />
          ))}

          <Button
            onClick={onAddRow}
            sx={{
              minWidth: 0,
              width: "40px",
              height: "40px",
              padding: 0,
              textTransform: "none", 
              color: "#404F57",
              backgroundColor: "#FBFBFB",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#E6F0E6" }
            }}
          >
            <AddIcon />
          </Button>
          
        </Box>
      )}
    </div>
  );
};