const escapeHtml = (value: string | number | undefined, fallback = '') => {
  const text = value == null ? fallback : String(value);
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const slugify = (value: string | undefined, fallback = 'report-card') => {
  const text = value || fallback;
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || fallback;
};

export const downloadProfessionalReportCard = ({
  result,
  studentName,
  programTitle,
  issuedBy = 'Zion Study Centre'
}: {
  result: any;
  studentName?: string;
  programTitle?: string;
  issuedBy?: string;
}) => {
  const student = studentName || result?.student?.name || 'Student';
  const program = programTitle || result?.program?.title || 'Program';
  const academicYear = result?.academicYear || 'N/A';
  const term = result?.term || 'Current Term';
  const status = result?.status || 'Pending';
  const remarks = result?.remarks || 'Keep up the good work.';
  const issuedAt = result?.createdAt ? new Date(result.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(student)} Report Card</title>
    <style>
      :root {
        color-scheme: light;
        font-family: "Segoe UI", Arial, sans-serif;
      }
      body {
        margin: 0;
        background: #f4f7fb;
        color: #14213d;
        padding: 24px;
      }
      .card {
        max-width: 900px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #dce4f0;
        border-radius: 18px;
        box-shadow: 0 10px 35px rgba(20, 33, 61, 0.08);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #0f4c81 0%, #1d6fb8 100%);
        color: white;
        padding: 28px 32px;
      }
      .header h1 {
        margin: 0 0 4px;
        font-size: 28px;
      }
      .header p {
        margin: 0;
        opacity: 0.95;
      }
      .content {
        padding: 28px 32px 36px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        margin-bottom: 20px;
      }
      .panel {
        border: 1px solid #e5ebf3;
        border-radius: 12px;
        padding: 16px;
        background: #fafcff;
      }
      .panel h3 {
        margin: 0 0 8px;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #5b6b81;
      }
      .value {
        font-size: 18px;
        font-weight: 700;
        color: #14213d;
      }
      .metrics {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin: 20px 0;
      }
      .metric {
        border: 1px solid #e5ebf3;
        border-radius: 12px;
        padding: 14px;
        background: #f8fbff;
      }
      .metric .label {
        font-size: 12px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.07em;
      }
      .metric .score {
        margin-top: 6px;
        font-size: 20px;
        font-weight: 700;
        color: #0f4c81;
      }
      .status {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 999px;
        font-weight: 700;
        background: #e8f7ee;
        color: #237a45;
      }
      .remark-box {
        margin-top: 20px;
        border-left: 4px solid #1d6fb8;
        padding: 14px 16px;
        background: #f8fbff;
      }
      .footer {
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #e5ebf3;
        padding-top: 16px;
        color: #5b6b81;
        font-size: 14px;
      }
      @media print {
        body {
          background: white;
          padding: 0;
        }
        .card {
          box-shadow: none;
          border: none;
          border-radius: 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h1>Academic Report Card</h1>
        <p>${escapeHtml(issuedBy)}</p>
      </div>
      <div class="content">
        <div class="grid">
          <div class="panel">
            <h3>Student Name</h3>
            <div class="value">${escapeHtml(student)}</div>
          </div>
          <div class="panel">
            <h3>Program / Class</h3>
            <div class="value">${escapeHtml(program)}</div>
          </div>
          <div class="panel">
            <h3>Academic Year</h3>
            <div class="value">${escapeHtml(academicYear)}</div>
          </div>
          <div class="panel">
            <h3>Term</h3>
            <div class="value">${escapeHtml(term)}</div>
          </div>
        </div>

        <div class="metrics">
          <div class="metric">
            <div class="label">Assignment Avg</div>
            <div class="score">${escapeHtml(result?.assignmentAverage != null ? `${Number(result.assignmentAverage).toFixed(1)}%` : '0.0%')}</div>
          </div>
          <div class="metric">
            <div class="label">Quiz Avg</div>
            <div class="score">${escapeHtml(result?.quizAverage != null ? `${Number(result.quizAverage).toFixed(1)}%` : '0.0%')}</div>
          </div>
          <div class="metric">
            <div class="label">Overall Score</div>
            <div class="score">${escapeHtml(result?.overallScore != null ? `${Number(result.overallScore).toFixed(1)}%` : '0.0%')}</div>
          </div>
          <div class="metric">
            <div class="label">CGPA</div>
            <div class="score">${escapeHtml(result?.cgpa != null ? Number(result.cgpa).toFixed(2) : '0.00')}</div>
          </div>
        </div>

        <div class="panel">
          <h3>Performance Status</h3>
          <div class="status">${escapeHtml(status)}</div>
        </div>

        <div class="remark-box">
          <strong>Remarks:</strong> ${escapeHtml(remarks)}
        </div>

        <div class="footer">
          <div>Issued on ${escapeHtml(issuedAt)}</div>
          <div>Official Academic Record</div>
        </div>
      </div>
    </div>
  </body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slugify(student)}-${slugify(program)}-${slugify(academicYear)}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
