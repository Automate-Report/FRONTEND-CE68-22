import { useState, useEffect, SyntheticEvent } from "react";
import { Box, TextField, Autocomplete, IconButton, createFilterOptions, FilterOptionsState } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tag } from "@/src/types/tag";
import { TagRow } from "@/src/types/tag";

interface ExtendedTag extends Tag {
  inputValue?: string;
}

const filter = createFilterOptions<Tag>();

const getTextWidth = (text: string, font: string = "16px 'IBM Plex Sans Thai', sans-serif") => {
  if (typeof window === "undefined") return 120; 
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 120;
  context.font = font;
  const metrics = context.measureText(text || "Select tags"); 
  return Math.max(120, metrics.width + 70); 
};

interface TagItemProps {
  row: TagRow;
  index: number;
  availableTags: Tag[];
  onDropdownOpen: () => void;
  onRemoveRow: (index: number) => void;
  onTagChange: (index: number, val: string | Tag | null | ExtendedTag) => void;
  onDeleteTagFromDb: (tag: Tag) => void;
}

export const TagItem = ({ 
  row, 
  index, 
  availableTags, 
  onDropdownOpen, 
  onRemoveRow, 
  onTagChange, 
  onDeleteTagFromDb 
}: TagItemProps) => {
  
  const [inputText, setInputText] = useState<string>(row.tagName || "");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setInputText(row.tagName || "");
  }, [row.tagName]);

  const currentWidth = mounted ? getTextWidth(inputText) : 120;

  return (
    <Box>
      <Autocomplete
        disableClearable
        freeSolo
        forcePopupIcon
        
        inputValue={inputText}
        onInputChange={(event, newInputValue) => {
          setInputText(newInputValue);
        }}

        slotProps={{
          paper: {
            sx: {
              width: "fit-content",
              minWidth: "100%",
              "& .MuiAutocomplete-option": {
                whiteSpace: "nowrap",
              },
            },
          },
        }}

        sx={{ 
          width: `${currentWidth}px`,
          transition: "width 0.1s ease-out",
        }}
        
        popupIcon={<ExpandMoreIcon sx={{ color: "#404F57" }} />}
        options={availableTags}
        onOpen={onDropdownOpen}
        value={availableTags.find((t) => t.name === row.tagName) || row.tagName}
        
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return option.name;
        }}
        
        onChange={(event: SyntheticEvent, newValue: string | Tag | null | ExtendedTag) => {
          if (
            typeof newValue === 'object' && 
            newValue !== null && 
            'name' in newValue && 
            newValue.name === "DELETE_ROW_ACTION"
          ) {
            onRemoveRow(index);
            return;
          }
          onTagChange(index, newValue);
        }}

        filterOptions={(options: Tag[], params: FilterOptionsState<Tag>) => {
          const filtered = filter(options, params);
          const { inputValue } = params;
          const isExisting = options.some((option) => option.name.toLowerCase() === inputValue.toLowerCase());

          if (inputValue !== '' && !isExisting) {
            filtered.push({ 
              inputValue, 
              name: `Add "${inputValue}"`, 
              id: 0 
            } as ExtendedTag);
          }
          
          filtered.push({ id: -999, name: "DELETE_ROW_ACTION" } as Tag);
          return filtered;
        }}

        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          const optionObj = option as ExtendedTag;
          const optionName = typeof option === 'string' ? option : optionObj.name;

          if (optionName === "DELETE_ROW_ACTION") {
            return (
              <li key={key} {...otherProps} style={{ color: '#FE3B46', borderTop: '1px solid #eee', fontSize: "16px" }}>
                Remove this tag
              </li>
            );
          }
          if (optionName.startsWith('Add "')) {
            return (
              <li key={key} {...otherProps} style={{ color: '#404F57' }}>
                <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                {optionName}
              </li>
            );
          }
          return (
            <li key={key} {...otherProps}>
              <div className="flex justify-between items-center w-full text-[#404F57]">
                <span>{optionName}</span>
                {typeof option !== 'string' && option.id > 0 && (
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onDeleteTagFromDb(option as Tag); }}
                    sx={{ color: '#999', "&:hover": { color: '#d32f2f', backgroundColor: 'rgba(255,0,0,0.1)' } }}
                    title="Delete tag from system"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </li>
          );
        }}

        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select tags"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FBFBFB", 
                borderRadius: "8px",
                color: "#404F57",
                textTransform: "none",
                fontFamily: "var(--font-ibm-thai), sans-serif",
                paddingRight: "32px !important", 
                "& fieldset": { borderColor: "#FBFBFB" },
                "&.Mui-focused fieldset": { borderColor: "#FBFBFB" },
                "& input": { 
                  color: "#404F57",
                  fontSize: "16px",
                  fontWeight: 400,
                  fontFamily: "var(--font-ibm-thai), sans-serif",
                  "&::placeholder": { color: "#9AA6A8", opacity: 1 },
                }
              }
            }}
          />
        )}
      />
    </Box>
  );
};