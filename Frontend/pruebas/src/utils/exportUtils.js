import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportarPDF = (datos, titulo, subtitulo, fechaGeneracion, filtros) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Encabezado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(titulo, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(subtitulo, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Información de generación
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Generado: ${fechaGeneracion}`, 20, yPosition);
  yPosition += 7;

  // Filtros aplicados
  if (filtros && Object.keys(filtros).length > 0) {
    doc.text(`Filtros aplicados:`, 20, yPosition);
    yPosition += 5;
    Object.entries(filtros).forEach(([clave, valor]) => {
      if (valor) {
        doc.text(`  • ${clave}: ${valor}`, 25, yPosition);
        yPosition += 5;
      }
    });
    yPosition += 5;
  }

  // Tabla
  if (datos && datos.length > 0) {
    const columns = Object.keys(datos[0]);
    const rows = datos.map(item =>
      columns.map(col => {
        const valor = item[col];
        if (typeof valor === 'object') {
          return JSON.stringify(valor);
        }
        return valor || '';
      })
    );

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: yPosition,
      margin: { top: 20, right: 10, bottom: 10, left: 10 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      didDrawPage: (data) => {
        // Pie de página
        const pageCount = doc.internal.pages.length - 1;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(
          `Página ${data.pageNumber} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      },
    });
  }

  return doc;
};

export const descargarPDF = (doc, nombreArchivo) => {
  doc.save(`${nombreArchivo}.pdf`);
};

export const exportarExcel = (datos, nombreHoja, titulo) => {
  if (!datos || datos.length === 0) {
    console.error('No hay datos para exportar');
    return null;
  }

  // Crear workbook con los datos
  const tiposArchivo = {
    'Rutas': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Cargas': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Vehículos': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Usuarios': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  const csv = convertirACSV(datos);
  return csv;
};

export const convertirACSV = (datos) => {
  if (!datos || datos.length === 0) {
    return '';
  }

  const columnas = Object.keys(datos[0]);
  const encabezado = columnas.join(',');

  const filas = datos.map(item =>
    columnas.map(col => {
      const valor = item[col];
      // Escapar comillas y envolver en comillas si contiene comas
      if (typeof valor === 'string' && valor.includes(',')) {
        return `"${valor.replace(/"/g, '""')}"`;
      }
      return `"${valor || ''}"`;
    }).join(',')
  );

  return [encabezado, ...filas].join('\n');
};

export const descargarExcel = (csv, nombreArchivo) => {
  const elemento = document.createElement('a');
  elemento.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
  elemento.setAttribute('download', `${nombreArchivo}.csv`);
  elemento.style.display = 'none';
  document.body.appendChild(elemento);
  elemento.click();
  document.body.removeChild(elemento);
};

export const descargarJSON = (datos, nombreArchivo) => {
  const elemento = document.createElement('a');
  const contenido = JSON.stringify(datos, null, 2);
  elemento.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(contenido)}`);
  elemento.setAttribute('download', `${nombreArchivo}.json`);
  elemento.style.display = 'none';
  document.body.appendChild(elemento);
  elemento.click();
  document.body.removeChild(elemento);
};
