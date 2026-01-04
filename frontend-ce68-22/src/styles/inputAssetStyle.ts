export const commonInputStyles = {
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "#FBFBFB",
    "& .MuiOutlinedInput-root": {
      color: "#000",
      "& fieldset": { borderColor: "rgba(230, 240, 230, 0.3)" },
      "&:hover fieldset": { borderColor: "#E6F0E6" },
      "& input": {
         fontSize: "16px",
         fontWeight: 300,
         color: "#000",
         padding: "8.5px 14px"
      }
    },
    "& .MuiInputLabel-root": { color: "rgba(230, 240, 230, 0.7)" },
};