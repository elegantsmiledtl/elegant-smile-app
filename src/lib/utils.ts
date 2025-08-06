
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DentalCase } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadFile(content: string, fileName: string, contentType: string) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

export function convertJsonToCsv(jsonData: DentalCase[]): string {
    if (jsonData.length === 0) {
        return "";
    }
    const keys = Object.keys(jsonData[0]);
    const header = keys.join(',') + '\n';
    const rows = jsonData.map(row => {
        return keys.map(key => {
            let cellData = row[key as keyof DentalCase];
            
            // Handle Firestore Timestamps
            if (key === 'createdAt' && cellData && typeof (cellData as any).toDate === 'function') {
                return (cellData as any).toDate().toISOString();
            }

            if (cellData instanceof Date) {
                return cellData.toISOString().split('T')[0];
            }
            // Escape commas and quotes
            let cell = cellData ? String(cellData) : '';
            cell = cell.replace(/"/g, '""');
            if (cell.includes(',')) {
                cell = `"${cell}"`;
            }
            return cell;
        }).join(',');
    }).join('\n');

    return header + rows;
}


export function generateReport(cases: DentalCase[]): string {
  if (cases.length === 0) {
    return "No data available to generate a report.";
  }

  const totalCases = cases.length;

  const prosthesisTypes = cases.reduce((acc, c) => {
    const types = c.prosthesisType.split(',').map(t => t.trim()).filter(t => t);
    types.forEach(type => {
        acc[type] = (acc[type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const materials = cases.reduce((acc, c) => {
    const mats = c.material.split(',').map(m => m.trim()).filter(m => m);
    mats.forEach(material => {
        acc[material] = (acc[material] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const casesByDentist = cases.reduce((acc, c) => {
    acc[c.dentistName] = (acc[c.dentistName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  

  let report = `Elegant Smile Dental Lab - Summary Report\n`;
  report += `Generated on: ${new Date().toLocaleString()}\n`;
  report += `==================================================\n\n`;

  report += `Total Cases: ${totalCases}\n\n`;

  report += `--- Breakdown by Prosthesis Type ---\n`;
  Object.entries(prosthesisTypes).forEach(([type, count]) => {
    report += `${type}: ${count}\n`;
  });
  report += `\n`;

  report += `--- Breakdown by Material ---\n`;
  Object.entries(materials).forEach(([material, count]) => {
    report += `${material}: ${count}\n`;
  });
  report += `\n`;
  
  report += `--- Cases per Dentist ---\n`;
  Object.entries(casesByDentist).forEach(([dentist, count]) => {
    report += `${dentist}: ${count}\n`;
  });
  report += `\n`;

  report += `\n==================================================\n`;
  report += `End of Report\n`;

  return report;
}
