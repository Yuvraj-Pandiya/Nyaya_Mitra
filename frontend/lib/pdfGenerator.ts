import jsPDF from 'jspdf';
import type { DocumentFormData } from '../types';
import { NOTO_SANS_DEVANAGARI_BASE64 } from './fonts';

// ─── Font Registration ────────────────────────────────────────────────────────
function registerFonts(doc: jsPDF) {
  // Add Noto Sans Devanagari
  doc.addFileToVFS('NotoSansDevanagari.ttf', NOTO_SANS_DEVANAGARI_BASE64);
  doc.addFont('NotoSansDevanagari.ttf', 'NotoSansDevanagari', 'normal');
  doc.setFont('NotoSansDevanagari');
}

// ─── Shared header ────────────────────────────────────────────────────────────
function addHeader(doc: jsPDF, title: string) {
  doc.setFillColor(26, 86, 219);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text('NyayaSaathi — Legal Aid Platform', 15, 9);
  doc.setFontSize(10);
  doc.text('nyayasaathi.in | Legal Information Only', 15, 15);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text(title, 15, 32);
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.setFontSize(10);
  doc.text('Date: ' + new Date().toLocaleDateString('en-IN'), 150, 32);
  doc.setDrawColor(26, 86, 219);
  doc.line(15, 36, 195, 36);
}

// ─── Shared footer ────────────────────────────────────────────────────────────
function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont('NotoSansDevanagari', 'normal');
    doc.text('DISCLAIMER: This is a template document for informational purposes only. This is not legal advice.', 15, 285);
    doc.text('Verify all information before submission. NyayaSaathi is not responsible for legal outcomes.', 15, 289);
    doc.text('Page ' + i + ' of ' + pageCount, 185, 289);
  }
}

// ─── Field helper ─────────────────────────────────────────────────────────────
function addField(doc: jsPDF, label: string, value: string, y: number): number {
  doc.setFont('NotoSansDevanagari', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(26, 86, 219);
  doc.text(label + ':', 15, y);
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.setTextColor(0, 0, 0);
  const lines = doc.splitTextToSize(value || 'N/A', 145);
  doc.text(lines, 55, y);
  return y + (lines.length * 5) + 3;
}

// ─── Section header helper ───────────────────────────────────────────────────
function addSectionHeader(doc: jsPDF, title: string, y: number): number {
  doc.setFillColor(239, 246, 255);
  doc.rect(13, y - 4, 184, 10, 'F');
  doc.setFont('NotoSansDevanagari', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(26, 86, 219);
  doc.text(title, 15, y + 2);
  doc.setTextColor(0, 0, 0);
  return y + 12;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. GENERAL COMPLAINT / GRIEVANCE
// ─────────────────────────────────────────────────────────────────────────────
export function generateComplaintPDF(
  fields: DocumentFormData,
  templateTitle: string,
  lawCitation: string
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  registerFonts(doc);
  addHeader(doc, templateTitle);
  let y = 45;

  // Addressee
  doc.setFontSize(11);
  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text('TO,', 15, y); y += 6;
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.text(fields.respondentName || 'The Appropriate Authority', 15, y); y += 5;
  const respLines = doc.splitTextToSize(fields.respondentAddress || '', 165);
  if (fields.respondentAddress) { doc.text(respLines, 15, y); y += respLines.length * 5; }
  y += 8;

  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text('SUBJECT: Complaint / Grievance Application', 15, y); y += 8;
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.text('Respected Sir/Madam,', 15, y); y += 7;

  const body = doc.splitTextToSize(
    'I, ' + (fields.name || '___') + ', residing at ' + (fields.address || '___') +
    ', hereby lodge this complaint regarding the matter described below. The incident occurred on ' +
    (fields.incidentDate || '___') + '. ' + (fields.description || '') +
    ' I request your kind intervention and appropriate action under the applicable laws including ' +
    lawCitation + '.',
    180
  );
  doc.text(body, 15, y); y += body.length * 5 + 10;

  y = addSectionHeader(doc, 'COMPLAINANT DETAILS', y);
  y = addField(doc, 'Name', fields.name, y);
  y = addField(doc, 'Address', fields.address, y);
  y = addField(doc, 'Phone', fields.phone, y);
  y = addField(doc, 'Date of Incident', fields.incidentDate, y);
  if (fields.amount) y = addField(doc, 'Amount Involved', 'Rs. ' + fields.amount, y);

  y += 15;
  doc.text('Yours sincerely,', 15, y); y += 10;
  doc.text('____________________', 15, y); y += 5;
  doc.text(fields.name || '(Signature)', 15, y); y += 5;
  doc.text('Date: ' + (fields.date || new Date().toLocaleDateString('en-IN')), 15, y);

  addFooter(doc);
  doc.save(templateTitle.replace(/\s+/g, '_') + '.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. RTI APPLICATION
// ─────────────────────────────────────────────────────────────────────────────
export function generateRTIPDF(fields: DocumentFormData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  registerFonts(doc);
  addHeader(doc, 'RTI Application under Right to Information Act, 2005');
  let y = 45;

  // Addressee
  doc.setFontSize(10);
  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text('TO,', 15, y); y += 6;
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.text('The Public Information Officer', 15, y); y += 5;
  doc.text(fields.authority || 'Concerned Government Department', 15, y); y += 8;

  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text('SUBJECT: Application under Right to Information Act, 2005 — Section 6(1)', 15, y); y += 8;
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.text('Respected Public Information Officer,', 15, y); y += 7;

  const intro = doc.splitTextToSize(
    'I, ' + (fields.name || '___') + ', a citizen of India, residing at ' + (fields.address || '___') +
    ', wish to seek the following information under the Right to Information Act, 2005:',
    180
  );
  doc.text(intro, 15, y); y += intro.length * 5 + 5;

  y = addSectionHeader(doc, 'INFORMATION REQUESTED', y);
  const infoLines = doc.splitTextToSize(fields.infoRequested || '(Please specify the information you seek)', 175);
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.text(infoLines, 15, y); y += infoLines.length * 5 + 8;

  y = addSectionHeader(doc, 'PERIOD / REFERENCE', y);
  doc.text('Period of information sought: ________________________', 15, y); y += 8;
  doc.text('Reference number (if any): ________________________', 15, y); y += 12;

  doc.text('Application fee of Rs. 10/- has been paid via [IPO / Postal Order / Court Fee Stamp / Online].', 15, y); y += 6;
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('(BPL applicants are exempt from fee — attach BPL certificate if applicable)', 15, y); y += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text('I request you to provide the above information within 30 days as mandated by Section 7(1) of the RTI Act.', 15, y); y += 12;
  doc.text('If information is not available with you, kindly transfer this application to the concerned PIO under Section 6(3).', 15, y); y += 15;

  doc.text('Yours faithfully,', 15, y); y += 10;
  doc.text('____________________', 15, y); y += 5;
  doc.text(fields.name || '(Signature)', 15, y); y += 5;
  doc.text(fields.address || '', 15, y); y += 5;
  doc.text('Phone: ' + (fields.phone || ''), 15, y); y += 5;
  doc.text('Date: ' + (fields.date || new Date().toLocaleDateString('en-IN')), 15, y);

  addFooter(doc);
  doc.save('RTI_Application.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONSUMER COMPLAINT LETTER
// ─────────────────────────────────────────────────────────────────────────────

export function generateConsumerComplaintPDF(fields: DocumentFormData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  registerFonts(doc);
  addHeader(doc, 'Consumer Complaint — Consumer Protection Act, 2019');
  let y = 45;

  // Addressee
  doc.setFontSize(10);
  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text('TO,', 15, y); y += 6;
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.text('The President / Member,', 15, y); y += 5;
  doc.text('District Consumer Disputes Redressal Commission', 15, y); y += 5;
  doc.text(fields.respondentAddress || '[District Name]', 15, y); y += 10;

  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text('SUBJECT: Complaint under Consumer Protection Act, 2019', 15, y); y += 8;

  y = addSectionHeader(doc, 'COMPLAINANT (CONSUMER)', y);
  y = addField(doc, 'Name', fields.name, y);
  y = addField(doc, 'Address', fields.address, y);
  y = addField(doc, 'Phone', fields.phone, y);

  y = addSectionHeader(doc, 'OPPOSITE PARTY (SELLER / SERVICE PROVIDER)', y);
  y = addField(doc, 'Company', fields.respondentName || 'N/A', y);
  y = addField(doc, 'Address', fields.respondentAddress || 'N/A', y);

  y = addSectionHeader(doc, 'TRANSACTION DETAILS', y);
  y = addField(doc, 'Date of Purchase', fields.incidentDate, y);
  if (fields.amount) y = addField(doc, 'Amount Paid', 'Rs. ' + fields.amount, y);

  y = addSectionHeader(doc, 'DEFECT / DEFICIENCY DETAILS', y);
  const defLines = doc.splitTextToSize(fields.description || '(Describe the issue)', 180);
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.text(defLines, 15, y); y += defLines.length * 5 + 8;

  y = addSectionHeader(doc, 'RELIEF SOUGHT', y);
  const reliefSought = `I request the Commission to direct the Opposite Party to refund the amount of Rs. ${fields.amount || '___'} with interest and pay compensation for mental agony and litigation costs.`;
  const reliefLines = doc.splitTextToSize(reliefSought, 180);
  doc.text(reliefLines, 15, y); y += reliefLines.length * 5 + 8;

  // Declaration
  doc.setFont('NotoSansDevanagari', 'italic');
  doc.setFontSize(9);
  const decl = doc.splitTextToSize(
    'I the complainant do hereby declare that the facts stated in this complaint are true and correct to the best of my knowledge and belief. No similar complaint has been filed before any other court/forum.',
    180
  );
  doc.text(decl, 15, y); y += decl.length * 5 + 12;
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.setFontSize(10);

  doc.text('Place: ____________________', 15, y);
  doc.text('Date: ' + (fields.date || new Date().toLocaleDateString('en-IN')), 120, y); y += 12;
  doc.text('Signature of Complainant: ____________________', 15, y); y += 5;
  doc.text(fields.name, 15, y);

  addFooter(doc);
  doc.save('Consumer_Complaint.pdf');
}

export function generateFIRDraftPDF(fields: DocumentFormData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  registerFonts(doc);
  addHeader(doc, 'FIR Draft / Police Complaint — Section 154 CrPC');
  let y = 45;

  // Addressee
  doc.setFontSize(10);
  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text('TO,', 15, y); y += 6;
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.text('The Station House Officer (SHO)', 15, y); y += 5;
  doc.text(fields.respondentName || 'Police Station', 15, y); y += 5;
  if (fields.respondentAddress) {
    const addrLines = doc.splitTextToSize(fields.respondentAddress, 165);
    doc.text(addrLines, 15, y); y += addrLines.length * 5;
  }
  y += 8;

  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text('SUBJECT: Complaint for registration of FIR under Section 154 of CrPC, 1973', 15, y); y += 8;
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.text('Respected Sir/Ma\'am,', 15, y); y += 7;

  const intro = doc.splitTextToSize(
    'I, ' + (fields.name || '___') + ', residing at ' + (fields.address || '___') +
    ', contact: ' + (fields.phone || '___') + ', hereby submit this written complaint and request you to register an FIR immediately.',
    180
  );
  doc.text(intro, 15, y); y += intro.length * 5 + 6;

  y = addSectionHeader(doc, 'COMPLAINANT DETAILS', y);
  y = addField(doc, 'Full Name', fields.name, y);
  y = addField(doc, 'Address', fields.address, y);
  y = addField(doc, 'Phone', fields.phone, y);
  if (fields.complainantId) y = addField(doc, 'ID Proof', fields.complainantId, y);

  y = addSectionHeader(doc, 'INCIDENT DETAILS', y);
  y = addField(doc, 'Date', fields.incidentDate, y);
  y = addField(doc, 'Time', fields.incidentTime || 'N/A', y);
  y = addField(doc, 'Location', fields.incidentLocation || 'N/A', y);

  y = addSectionHeader(doc, 'DESCRIPTION OF INCIDENT', y);
  const descLines = doc.splitTextToSize(
    fields.description || '(Describe what happened in detail)',
    180
  );
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.text(descLines, 15, y); y += descLines.length * 5 + 8;

  if (fields.accusedNames) {
    y = addSectionHeader(doc, 'NAMES OF ACCUSED (Known / Suspected)', y);
    const accLines = doc.splitTextToSize(fields.accusedNames, 180);
    doc.text(accLines, 15, y); y += accLines.length * 5 + 6;
  }

  if (fields.witnessNames) {
    y = addSectionHeader(doc, 'WITNESSES', y);
    const witLines = doc.splitTextToSize(fields.witnessNames, 180);
    doc.text(witLines, 15, y); y += witLines.length * 5 + 6;
  }

  if (fields.evidenceList) {
    y = addSectionHeader(doc, 'EVIDENCE / DOCUMENTS', y);
    const evLines = doc.splitTextToSize(fields.evidenceList, 180);
    doc.text(evLines, 15, y); y += evLines.length * 5 + 8;
  }

  // Closing
  const closing = doc.splitTextToSize(
    'I request you to register an FIR against the accused under the appropriate sections of law and take necessary legal action. I am ready to assist in the investigation. Kindly provide me a copy of the FIR after registration free of cost as per Section 154(2) CrPC.',
    180
  );
  doc.text(closing, 15, y); y += closing.length * 5 + 15;

  doc.text('Place: ' + (fields.respondentAddress?.split(',')[0] || '_____'), 15, y);
  doc.text('Date: ' + (fields.date || new Date().toLocaleDateString('en-IN')), 120, y); y += 12;
  doc.text('Signature of Complainant: ____________________', 15, y); y += 6;
  doc.text('Name: ' + (fields.name || ''), 15, y);

  // Warning box
  y += 15;
  if (y < 270) {
    doc.setFillColor(255, 251, 235);
    doc.rect(13, y - 3, 184, 16, 'F');
    doc.setDrawColor(253, 230, 138);
    doc.rect(13, y - 3, 184, 16, 'S');
    doc.setFont('NotoSansDevanagari', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(146, 64, 14);
    doc.text('⚠  IMPORTANT:', 16, y + 3);
    doc.setFont('NotoSansDevanagari', 'normal');
    doc.text('If police refuse to register FIR, approach the SP/DSP or file complaint before Magistrate u/s 156(3) CrPC.', 16, y + 9);
    doc.setTextColor(0, 0, 0);
  }

  addFooter(doc);
  doc.save('FIR_Draft_Complaint.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DOCUMENT CHECKLIST PDF
// ─────────────────────────────────────────────────────────────────────────────
export function generateChecklistPDF(
  items: { item: { en: string }; checked: boolean }[],
  situationTitle: string
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  registerFonts(doc);
  addHeader(doc, 'Document Checklist — ' + situationTitle);
  let y = 45;
  doc.setFontSize(12);
  doc.setFont('NotoSansDevanagari', 'bold');
  doc.text('Documents Required:', 15, y); y += 10;

  const checked = items.filter(i => i.checked).length;
  doc.setFontSize(9);
  doc.setFont('NotoSansDevanagari', 'normal');
  doc.setTextColor(14, 159, 110);
  doc.text(`${checked} of ${items.length} documents collected`, 15, y); y += 8;
  doc.setTextColor(0, 0, 0);

  items.forEach((it, i) => {
    doc.setFont('NotoSansDevanagari', 'normal');
    doc.setFontSize(10);
    const box = it.checked ? '[✓]' : '[ ]';
    const color = it.checked ? '#0e9f6e' : '#0f172a';
    doc.setTextColor(it.checked ? 14 : 15, it.checked ? 159 : 23, it.checked ? 110 : 42);
    doc.text(box + '  ' + (i + 1) + '. ' + it.item.en, 15, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
    if (y > 270) { doc.addPage(); y = 20; }
  });

  addFooter(doc);
  doc.save('Document_Checklist.pdf');
}
