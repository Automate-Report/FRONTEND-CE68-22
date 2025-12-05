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
import { TablePaginationActions } from "../../../components/projects/TablePaginationAction"; // ไฟล์จากข้อ 1
import { useProjectTable, SortColumn } from "./useProjectTable"; // ไฟล์จากข้อ 2

interface ProjectTableProps {
  data: Project[];
}

export function ProjectTable({ data = [] }: ProjectTableProps) {
  const {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    visibleRows,
    handleChangePage,
    handleChangeRowsPerPage,
    cycleSort,
  } = useProjectTable(data);

  const sortIndicator = (column: SortColumn) => {
    if (sortBy !== column) return <DefaultSortIcon />;
    if (sortOrder === "asc") return <AscIcon />;
    if (sortOrder === "desc") return <DescIcon />;
    return <DefaultSortIcon />;
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #e5e7eb" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-[#0F1518]">
            <TableRow>
              <TableCell
                sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                onClick={() => cycleSort("name")}
              >
                <div className="flex items-center pl-2">
                  <div className="text-[#E6F0E6]">Project Name</div>
                  <div className="pl-2">{sortIndicator("name")}</div>
                </div>
              </TableCell>

              <TableCell
                align="left"
                onClick={() => cycleSort("updated_at")}
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
            {visibleRows.map((project) => (
              <TableRow key={project.name}>
                <TableCell>
                  <div className="pl-2">{project.name}</div>
                </TableCell>
                <TableCell align="left">
                  {new Date(project.updated_at).toLocaleDateString("th-TH")}
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  );
}