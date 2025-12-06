// src/components/ProjectTable/index.tsx
import { Project } from "../../../types/project";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper
} from "@mui/material";

// Icons
import DefaultSortIcon from "../icon/DefaultSort"; // ปรับ path
import AscIcon from "../icon/AscIcon";
import DescIcon from "../icon/DescIcon";
import EditProjectIcon from "../icon/EditProject";
import DeleteProjectIcon from "../icon/DeleteProject";

// Imported Components & Hooks
import { TablePaginationActions } from "../TablePaginationAction"; 
import { SortOrder, SortColumn, useProjectTable } from "./useProjectTable"; 

interface ProjectTableProps {
  data: Project[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  sortBy: SortColumn | null;
  sortOrder: SortOrder;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSort: (column: SortColumn) => void;
}

export function ProjectTable({ 
  data = [], 
  totalCount,
  page,
  rowsPerPage,
  sortBy,
  sortOrder,
  onPageChange,        // รับมาแทน handleChangePage
  onRowsPerPageChange, // รับมาแทน handleChangeRowsPerPage
  onSort               // รับมาแทน cycleSort
}: ProjectTableProps){
  
  // ไม่เรียก useProjectTable ในนี้แล้ว รับค่ามาจาก Props แทน
  
  const sortIndicator = (column: SortColumn) => {
    if (sortBy !== column) return <DefaultSortIcon />;
    if (sortOrder === "asc") return <AscIcon />;
    if (sortOrder === "desc") return <DescIcon />;
    return <DefaultSortIcon />;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #e5e7eb" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-[#0F1518]">
            <TableRow>
              <TableCell
                sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                onClick={() => onSort("name")}
              >
                <div className="flex items-center pl-2">
                  <div className="text-[#E6F0E6]">Project Name</div>
                  <div className="pl-2">{sortIndicator("name")}</div>
                </div>
              </TableCell>

              <TableCell
                align="left"
                onClick={() => onSort("updated_at")}
                sx={{ cursor: "pointer", width: "1%", whiteSpace: "nowrap" }}
              >
                <div className="flex items-center">
                  <div className="text-[#E6F0E6]">Last Updated</div>
                  <div className="pl-2">{sortIndicator("updated_at")}</div>
                </div>
              </TableCell>

              <TableCell align="right" sx={{ width: "1%" }}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((project, index) => (
              <TableRow key={project.id} 
              sx={{
                backgroundColor: index % 2 === 0 ? "#FBFBFB" : "#EFF1F0", 
              }}>
                <TableCell>
                  <div className="pl-2">{project.name}</div>
                </TableCell>
                <TableCell align="left">
                  {formatDate(project.updated_at)}
                </TableCell>
                <TableCell align="right">
                  <div className="flex justify-around pr-2">
                    <div className="pl-6"><EditProjectIcon /></div>
                    <div className="pl-6"><DeleteProjectIcon /></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={totalCount} 
        rowsPerPage={rowsPerPage} 
        page={page} 
        // 5. เชื่อม Event Handlers ให้ถูกต้อง
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  );
}