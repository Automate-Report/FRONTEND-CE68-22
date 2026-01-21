
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Divider
} from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from "next/link";
import { GenericBreadcrumbsProps } from "@/src/types/common";

export function GenericBreadcrums({ items }: GenericBreadcrumbsProps)
{
    return (
        <Box sx={{ mb: 3}}>
            <Breadcrumbs 
                aria-label="breadcrumb" 
                separator={<NavigateNextIcon fontSize="small"/>} 
                sx={{ 
                    color: "#E6F0E6", 
                    fontSize: "16px",
                    fontWeight: 400,
            }}
            >
                {items.map((item, index) => {
                // เช็คว่าเป็นชั้นสุดท้ายหรือไม่?
                const isLast = index === items.length - 1;

                // ถ้าเป็นชั้นสุดท้าย: แสดงเป็น Text ธรรมดา (Styling ตามที่คุณต้องการ)
                if (isLast) {
                    return (
                    <Typography 
                        key={index}
                        color="#E6F0E6"
                        sx={{ fontSize: "16px", fontWeight: 300 }}
                    >
                        {item.label}
                    </Typography>
                    );
                }

                // ถ้าไม่ใช่ชั้นสุดท้าย: แสดงเป็น Link
                return (
                    <MuiLink
                        key={index}
                        component={Link} // ผสาน MuiLink กับ Next/Link
                        href={item.href || "#"} 
                        underline="hover" 
                        color="inherit"
                    >
                        {item.label}
                    </MuiLink>
                    );
                })}
            </Breadcrumbs>
            <Divider 
                sx={{ 
                    mt: 2,           // margin-top: เว้นระยะห่างจากตัวหนังสือลงมาหน่อย (2 = 16px)
                    borderColor: "#D8D4D4", // กำหนดสีของเส้น (ถ้าพื้นหลังดำ ควรใช้สีเทาเข้ม)
                    borderBottomWidth: 1
                }} 
            />
        </Box>
    );
}