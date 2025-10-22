// PDF Generation using jsPDF
import { jsPDF } from 'jspdf';

export const generateResumePDF = (data) => {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = margin;

    // Helper function to add text with word wrap
    const addText = (text, size, isBold = false) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, margin, yPos);
        yPos += lines.length * size * 0.5;
    };

    // Header - Name
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(data.name || 'Your Name', margin, 25);

    // Contact Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contactInfo = [
        data.phone,
        data.email,
        data.location
    ].filter(Boolean).join(' | ');
    doc.text(contactInfo, margin, 35);

    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPos = 50;

    // Professional Summary
    if (data.summary) {
        addText('PROFESSIONAL SUMMARY', 14, true);
        yPos += 2;
        addText(data.summary, 10);
        yPos += 5;
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
        addText('SKILLS & CERTIFICATIONS', 14, true);
        yPos += 2;
        data.skills.forEach(skill => {
            addText(`• ${skill}`, 10);
            yPos += 1;
        });
        yPos += 3;
    }

    // Work Experience
    if (data.experience && data.experience.length > 0) {
        addText('WORK EXPERIENCE', 14, true);
        yPos += 2;

        data.experience.forEach((job, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = margin;
            }

            addText(job.title || 'Job Title', 12, true);
            addText(`${job.company || 'Company'} | ${job.duration || 'Duration'}`, 10);
            yPos += 1;
            if (job.responsibilities) {
                const responsibilities = job.responsibilities.split('\n');
                responsibilities.forEach(resp => {
                    if (resp.trim()) {
                        addText(`• ${resp.trim()}`, 10);
                        yPos += 1;
                    }
                });
            }
            yPos += 3;
        });
    }

    // Education
    if (data.education) {
        if (yPos > 250) {
            doc.addPage();
            yPos = margin;
        }
        addText('EDUCATION', 14, true);
        yPos += 2;
        addText(data.education, 10);
        yPos += 5;
    }

    // Certifications (if separate from skills)
    if (data.certifications && data.certifications.length > 0) {
        if (yPos > 250) {
            doc.addPage();
            yPos = margin;
        }
        addText('CERTIFICATIONS', 14, true);
        yPos += 2;
        data.certifications.forEach(cert => {
            addText(`• ${cert}`, 10);
            yPos += 1;
        });
    }

    // Save the PDF
    doc.save(`${(data.name || 'resume').replace(/\s+/g, '_')}_resume.pdf`);
};
