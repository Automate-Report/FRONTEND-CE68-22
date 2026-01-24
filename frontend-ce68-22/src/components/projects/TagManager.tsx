// src/app/projects/create/components/TagManager.tsx
import { Box, Button, Autocomplete, TextField, IconButton, CircularProgress, createFilterOptions } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import { Tag } from "@/src/types/tag";

const filter = createFilterOptions<Tag>();

interface TagManagerProps {
  selectedTags: string[];
  availableTags: Tag[];
  fetchingTags: boolean;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onTagChange: (index: number, val: any) => void;
  onDeleteTagFromDb: (tag: Tag) => void;
  onDropdownOpen: () => void;
}

export const TagManager = ({
  selectedTags,
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
        selectedTags.map((tagValue, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Autocomplete
              disableClearable
              freeSolo
              fullWidth
              options={availableTags}
              onOpen={onDropdownOpen}
              value={availableTags.find(t => t.name === tagValue) || tagValue}
              
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
                      <DeleteOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
                      Remove this row
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
                  placeholder="Select or Create a tag"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FBFBFB", borderRadius: "16px",
                      "& fieldset": { borderColor: "#FBFBFB" },
                      "&.Mui-focused fieldset": { borderColor: "#FBFBFB" },
                      "& input": { fontSize: "16px", fontWeight: 300 }
                    }
                  }}
                />
              )}
            />
          </Box>
        ))
      )}

      <Button
        startIcon={<AddIcon />}
        onClick={onAddRow}
        sx={{
          textTransform: "none", fontSize: 16, fontWeight: 600, color: "#FE3B46",
          "&:hover": { backgroundColor: "rgba(254, 59, 70, 0.08)" }
        }}
      >
        Add another tag
      </Button>
    </div>
  );
};