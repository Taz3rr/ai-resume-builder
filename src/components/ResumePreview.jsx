import React, { useRef } from 'react';
import { translations } from '../utils/translations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumePreview = ({ language, resumeData, showPreview }) => {
    const t = translations[language];
    const resumeRef = useRef(null);

    const downloadPDF = async () => {
        const element = resumeRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        const filename = `${resumeData.personalInfo.name || 'resume'}.pdf`;
        pdf.save(filename);
        return { pdf, filename };
    };

    const shareOnWhatsApp = async () => {
        // Ask user if they want to share as TEXT or PDF
        const shareAsPDF = window.confirm('Share resume as PDF?\n\nClick OK to share PDF\nClick Cancel to share as Text');
        
        if (shareAsPDF) {
            // Generate PDF and share
            const { pdf, filename } = await downloadPDF();
            const pdfBlob = pdf.output('blob');
            
            // Check if Web Share API is available (for mobile)
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], filename, { type: 'application/pdf' })] })) {
                try {
                    const file = new File([pdfBlob], filename, { type: 'application/pdf' });
                    await navigator.share({
                        title: 'My Resume',
                        text: `${resumeData.personalInfo.name || 'Professional'} - Resume`,
                        files: [file]
                    });
                } catch (error) {
                    console.error('Error sharing:', error);
                    // Fallback: download PDF and show message
                    alert('PDF downloaded! Please share it manually via WhatsApp.');
                }
            } else {
                // Desktop: Download PDF and show WhatsApp message
                alert('PDF downloaded! Please share it manually via WhatsApp.');
            }
        } else {
            // Share as text
            const { personalInfo, skills, experience, certifications, education } = resumeData;
            let message = `📄 *${personalInfo.name || 'My Resume'}*\n\n`;
            
            if (personalInfo.trade) message += `🔧 *${personalInfo.trade}*\n\n`;
            if (personalInfo.phone) message += `📞 ${personalInfo.phone}\n`;
            if (personalInfo.email) message += `📧 ${personalInfo.email}\n`;
            if (personalInfo.address) message += `📍 ${personalInfo.address}\n`;
            
            if (skills && skills.length > 0) {
                message += `\n⚡ *Skills:*\n${skills.map(s => `• ${s}`).join('\n')}\n`;
            }
            
            if (experience && experience.length > 0 && experience[0].description) {
                message += `\n💼 *Experience:*\n${experience[0].description}\n`;
            }
            
            if (certifications && certifications.length > 0) {
                message += `\n🎓 *Certifications:*\n${certifications.map(c => `• ${c}`).join('\n')}\n`;
            }
            
            if (education && education.length > 0 && education[0].description) {
                message += `\n📚 *Education:*\n${education[0].description}\n`;
            }
            
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    const printResume = () => {
        window.print();
    };

    if (!showPreview) {
        return (
            <div className="h-[600px] flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <svg
                        className="mx-auto h-24 w-24 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <p className="mt-4 text-lg font-medium">{t.preview}</p>
                    <p className="mt-2 text-sm">Fill in your details to see the preview</p>
                </div>
            </div>
        );
    }

    const { personalInfo, skills, experience, certifications, education } = resumeData;

    return (
        <div className="h-[600px] flex flex-col">
            <div className="mb-4 flex gap-2">
                <button
                    onClick={downloadPDF}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t.downloadPDF}
                </button>
                <button
                    onClick={shareOnWhatsApp}
                    className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {t.whatsappShare}
                </button>
                <button
                    onClick={printResume}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    {t.printResume}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-lg">
                <div ref={resumeRef} className="p-4 sm:p-8 bg-white resume-content">
                    {/* Header */}
                    <div className="border-b-4 border-indigo-600 pb-3 sm:pb-4 mb-4 sm:mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 uppercase break-words">
                            {personalInfo.name || 'YOUR NAME'}
                        </h1>
                        <p className="text-lg sm:text-xl text-indigo-600 font-semibold mt-1 break-words">
                            {personalInfo.trade || 'Your Trade/Profession'}
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="mb-4 sm:mb-6 flex flex-col gap-2 text-sm text-gray-700">
                        {personalInfo.phone && (
                            <div className="flex items-start gap-2">
                                <span className="font-semibold flex-shrink-0">📞</span>
                                <span className="break-words">{personalInfo.phone}</span>
                            </div>
                        )}
                        {personalInfo.email && (
                            <div className="flex items-start gap-2">
                                <span className="font-semibold flex-shrink-0">✉️</span>
                                <span className="break-words">{personalInfo.email}</span>
                            </div>
                        )}
                        {personalInfo.address && (
                            <div className="flex items-start gap-2">
                                <span className="font-semibold flex-shrink-0">📍</span>
                                <span className="break-words flex-1">{personalInfo.address}</span>
                            </div>
                        )}
                    </div>

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase border-b-2 border-gray-300 pb-1">
                                Skills & Competencies
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && experience[0].description && (
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase border-b-2 border-gray-300 pb-1">
                                Work Experience
                            </h2>
                            {experience.map((exp, idx) => (
                                <div key={idx} className="mb-3">
                                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase border-b-2 border-gray-300 pb-1">
                                Certifications & Licenses
                            </h2>
                            <ul className="list-disc list-inside space-y-2">
                                {certifications.map((cert, idx) => (
                                    <li key={idx} className="text-gray-700">
                                        {cert}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && education[0].description && (
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase border-b-2 border-gray-300 pb-1">
                                Education
                            </h2>
                            {education.map((edu, idx) => (
                                <div key={idx} className="mb-3">
                                    <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;
