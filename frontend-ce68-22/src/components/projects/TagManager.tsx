// src/app/projects/create/components/TagManager.tsx
import { Box, Button, Autocomplete, TextField, IconButton, CircularProgress, createFilterOptions } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tag } from "@/src/types/tag";
import { TagRow } from "@/src/hooks/project/use-createProject";

const filter = createFilterOptions<Tag>();

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

  return (
    <div className="pb-8">
      <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Tags</div>

      {fetchingTags && availableTags.length === 0 ? (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: '#888' }}>
          <CircularProgress size={20} /> Loading tags...
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
          
          {/* 2. วนลูป tagRows แทน selectedTags */}
          {tagRows.map((row, index) => (
            
            /* 3. ใช้ row.id เป็น Key (สำคัญมาก!) เพื่อแก้บั๊กค่าค้าง */
            <Box key={row.id}>
              <Autocomplete
                disableClearable
                freeSolo
                forcePopupIcon
                sx={{ width: "200px" }}
                
                popupIcon={<ExpandMoreIcon sx={{ color: "#404F57" }} />}
                options={availableTags}
                onOpen={onDropdownOpen}

                // 4. แก้ value ให้ดึงจาก row.tagName
                value={availableTags.find(t => t.name === row.tagName) || row.tagName}
                
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                
                onChange={(event, newValue) => {
                  if (typeof newValue === 'object' && newValue !== null && 'name' in newValue && newValue.name === "DELETE_ROW_ACTION") {
                    onRemoveRow(index);
                    return;
                  }
                  onTagChange(index, newValue);
                }}

                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some((option) => option.name.toLowerCase() === inputValue.toLowerCase());

                  if (inputValue !== '' && !isExisting) {
                    filtered.push({ inputValue, name: `Add "${inputValue}"`, id: 0 } as any);
                  }
                  filtered.push({ id: -999, name: "DELETE_ROW_ACTION" } as Tag);
                  return filtered;
                }}

                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  const optionName = typeof option === 'string' ? option : option.name;

                  if (optionName === "DELETE_ROW_ACTION") {
                    return (
                      <li key={key} {...otherProps} style={{ color: '#d32f2f', borderTop: '1px solid #eee' }}>
                        {/* <DeleteOutlineIcon sx={{ mr: 1, fontSize: 20 }} /> */}
                        Remove this tag
                      </li>
                    );
                  }
                  if (optionName.startsWith('Add "')) {
                    return (
                      <li key={key} {...otherProps} style={{ color: '#1976d2' }}>
                        <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                        {optionName}
                      </li>
                    );
                  }
                  return (
                    <li key={key} {...otherProps}>
                      <div className="flex justify-between items-center w-full">
                        <span>{optionName}</span>
                        {typeof option !== 'string' && option.id > 0 && (
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onDeleteTagFromDb(option); }}
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
                          fontSize: "14px",
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