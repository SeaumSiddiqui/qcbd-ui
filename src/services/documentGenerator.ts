export const documentGenerator = {
  generateApplicationDocument(application: any): string {
    const formatDate = (dateString?: string) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('bn-BD');
    };

    const getGenderText = (gender?: string) => {
      return gender === 'MALE' ? 'ছেলে' : gender === 'FEMALE' ? 'মেয়ে' : '';
    };

    const getPhysicalConditionText = (condition?: string) => {
      switch (condition) {
        case 'HEALTHY': return 'সুস্থ';
        case 'SICK': return 'অসুস্থ';
        case 'DISABLED': return 'প্রতিবন্ধী';
        default: return '';
      }
    };

    const getResidenceStatusText = (status?: string) => {
      switch (status) {
        case 'OWN': return 'নিজ';
        case 'RENTED': return 'ভাড়া';
        case 'SHELTERED': return 'আশ্রয়প্রাপ্ত';
        case 'HOMELESS': return 'গৃহহীন';
        default: return '';
      }
    };

    return `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>এতিম নিবন্ধন ফর্ম - ${application.primaryInformation?.fullName}</title>
    <style>
        body {
            font-family: 'SolaimanLipi', Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #000;
            font-size: 14px;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
        }
        .logo-section {
            display: flex;
            align-items: center;
        }
        .logo {
            width: 50px;
            height: 50px;
            background: #dc2626;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            margin-right: 15px;
            font-size: 16px;
        }
        .org-info {
            text-align: left;
        }
        .org-bangla {
            font-size: 16px;
            font-weight: bold;
            color: #dc2626;
            margin: 0;
        }
        .org-english {
            font-size: 12px;
            color: #666;
            margin: 0;
        }
        .title-section {
            text-align: center;
            flex: 1;
        }
        .main-title {
            font-size: 20px;
            font-weight: bold;
            margin: 0;
        }
        .photo-box {
            width: 80px;
            height: 100px;
            border: 2px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        .form-section {
            margin-bottom: 15px;
        }
        .form-row {
            display: flex;
            margin-bottom: 8px;
            align-items: center;
            gap: 20px;
        }
        .form-field {
            display: flex;
            align-items: center;
            flex: 1;
            min-width: 0;
        }
        .form-label {
            margin-right: 8px;
            font-weight: normal;
            white-space: nowrap;
            font-size: 13px;
        }
        .underline {
            border-bottom: 1px solid #000;
            min-height: 18px;
            flex: 1;
            padding: 2px 4px;
            font-size: 13px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 12px;
        }
        th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
        }
        th {
            background-color: #f3f4f6;
            font-weight: bold;
        }
        .signature-table th {
            background-color: #fef3c7;
            font-weight: bold;
            padding: 8px;
        }
        .signature-cell {
            height: 50px;
            vertical-align: middle;
        }
        .section-title {
            font-weight: bold;
            margin: 15px 0 8px 0;
            font-size: 14px;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 15px;
            margin: 8px 0;
            font-size: 13px;
        }
        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .checkbox-item input {
            margin: 0;
        }
        .footer-note {
            margin-top: 20px;
            font-size: 11px;
            text-align: justify;
            line-height: 1.4;
        }
        .info-text {
            font-size: 13px;
            margin-bottom: 10px;
        }
        @media print {
            body { margin: 0; font-size: 12px; }
            .no-print { display: none; }
            .header { page-break-after: avoid; }
            table { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <div class="logo">QC</div>
            <div class="org-info">
                <div class="org-bangla">কাতার দাতব্য</div>
                <div class="org-english">QATAR CHARITY</div>
            </div>
        </div>
        <div class="title-section">
            <h1 class="main-title">এতিম নিবন্ধন ফর্ম</h1>
        </div>
        <div class="photo-box">
            ছবি:
        </div>
    </div>

    <div class="info-text">
        এতিমের বিস্তারিত তথ্য:
    </div>

    <div class="form-section">
        <div class="form-row">
            <div class="form-field">
                <span class="form-label">পূর্ণ নাম:</span>
                <span class="underline">${application.primaryInformation?.fullName || ''}</span>
            </div>
            <div class="form-field">
                <span class="form-label">জন্ম নিবন্ধন নং:</span>
                <span class="underline">${application.primaryInformation?.bcRegistration || ''}</span>
            </div>
            <div class="form-field">
                <span class="form-label">লিঙ্গ:</span>
                <span class="underline">${getGenderText(application.primaryInformation?.gender)}</span>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field">
                <span class="form-label">পিতার নাম:</span>
                <span class="underline">${application.primaryInformation?.fathersName || ''}</span>
            </div>
            <div class="form-field">
                <span class="form-label">জন্মতারিখ:</span>
                <span class="underline">${formatDate(application.primaryInformation?.dateOfBirth)}</span>
            </div>
            <div class="form-field">
                <span class="form-label">বয়স:</span>
                <span class="underline">${application.primaryInformation?.age || ''}</span>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field">
                <span class="form-label">মাতার নাম:</span>
                <span class="underline">${application.primaryInformation?.mothersName || ''}</span>
            </div>
            <div class="form-field">
                <span class="form-label">মাতার পেশা:</span>
                <span class="underline">${application.primaryInformation?.mothersOccupation || ''}</span>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field">
                <span class="form-label">পিতার মৃত্যুর তারিখ:</span>
                <span class="underline">${formatDate(application.primaryInformation?.dateOfDeath)}</span>
            </div>
            <div class="form-field">
                <span class="form-label">মৃত্যুর কারণ:</span>
                <span class="underline">${application.primaryInformation?.causeOfDeath || ''}</span>
            </div>
        </div>
    </div>

    <div class="section-title">বর্তমান ঠিকানা:</div>
    <div class="form-row">
        <div class="form-field">
            <span class="form-label">গ্রাম:</span>
            <span class="underline">${application.address?.presentVillage || ''}</span>
        </div>
        <div class="form-field">
            <span class="form-label">উপজেলা:</span>
            <span class="underline">${application.address?.presentSubDistrict || ''}</span>
        </div>
        <div class="form-field">
            <span class="form-label">জেলা:</span>
            <span class="underline">${application.address?.presentDistrict || ''}</span>
        </div>
    </div>

    <div class="section-title">স্থায়ী ঠিকানা:</div>
    <div class="form-row">
        <div class="form-field">
            <span class="form-label">গ্রাম:</span>
            <span class="underline">${application.address?.permanentVillage || ''}</span>
        </div>
        <div class="form-field">
            <span class="form-label">উপজেলা:</span>
            <span class="underline">${application.address?.permanentSubDistrict || ''}</span>
        </div>
        <div class="form-field">
            <span class="form-label">জেলা:</span>
            <span class="underline">${application.address?.permanentDistrict || ''}</span>
        </div>
    </div>

    <div class="form-row">
        <div class="form-field">
            <span class="form-label">পরিবারের সদস্য সংখ্যা:</span>
            <span class="underline">${application.primaryInformation?.numOfSiblings || ''}</span>
        </div>
    </div>

    ${(application.familyMembers && application.familyMembers.length > 0) ? `
    <table>
        <thead>
            <tr>
                <th>ক্র</th>
                <th>নাম</th>
                <th>বয়স</th>
                <th>লিঙ্গ</th>
                <th>পেশা</th>
                <th>বৈবাহিক অবস্থা</th>
            </tr>
        </thead>
        <tbody>
            ${application.familyMembers.map((member: any, index: number) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${member.name || ''}</td>
                    <td>${member.age || ''}</td>
                    <td>${getGenderText(member.siblingsGender)}</td>
                    <td>${member.occupation || ''}</td>
                    <td>${member.maritalStatus || ''}</td>
                </tr>
            `).join('')}
            ${Array.from({ length: Math.max(0, 5 - application.familyMembers.length) }).map((_, index) => `
                <tr>
                    <td>${application.familyMembers.length + index + 1}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    ` : `
    <table>
        <thead>
            <tr>
                <th>ক্র</th>
                <th>নাম</th>
                <th>বয়স</th>
                <th>লিঙ্গ</th>
                <th>পেশা</th>
                <th>বৈবাহিক অবস্থা</th>
            </tr>
        </thead>
        <tbody>
            ${Array.from({ length: 5 }).map((_, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    `}

    <div class="checkbox-group">
        <span>শারীরিক অবস্থা:</span>
        <div class="checkbox-item">
            <input type="radio" ${application.basicInformation?.physicalCondition === 'HEALTHY' ? 'checked' : ''} disabled>
            <span>সুস্থ</span>
        </div>
        <div class="checkbox-item">
            <input type="radio" ${application.basicInformation?.physicalCondition === 'SICK' ? 'checked' : ''} disabled>
            <span>অসুস্থ</span>
        </div>
        <div class="checkbox-item">
            <input type="radio" ${application.basicInformation?.physicalCondition === 'DISABLED' ? 'checked' : ''} disabled>
            <span>প্রতিবন্ধী</span>
        </div>
    </div>

    <div class="checkbox-group">
        <span>গুরুতর রোগ:</span>
        <div class="checkbox-item">
            <input type="radio" ${application.basicInformation?.hasCriticalIllness === true ? 'checked' : ''} disabled>
            <span>হ্যাঁ</span>
        </div>
        <div class="checkbox-item">
            <input type="radio" ${application.basicInformation?.hasCriticalIllness === false ? 'checked' : ''} disabled>
            <span>না</span>
        </div>
        <span style="margin-left: 20px;">রোগের ধরন:</span>
        <span class="underline" style="min-width: 200px;">${application.basicInformation?.typeOfIllness || ''}</span>
    </div>

    <div class="form-row">
        <div class="form-field">
            <span class="form-label">বাড়ির ধরন:</span>
            <span class="underline">${application.basicInformation?.houseType || ''}</span>
        </div>
        <div class="form-field">
            <span class="form-label">আবাসিক অবস্থা:</span>
            <span class="underline">${getResidenceStatusText(application.basicInformation?.residenceStatus)}</span>
        </div>
    </div>

    <div class="section-title">অভিভাবকের তথ্য:</div>
    <div class="form-row">
        <div class="form-field">
            <span class="form-label">নাম:</span>
            <span class="underline">${application.basicInformation?.guardiansName || ''}</span>
        </div>
        <div class="form-field">
            <span class="form-label">সম্পর্ক:</span>
            <span class="underline">${application.basicInformation?.guardiansRelation || ''}</span>
        </div>
        <div class="form-field">
            <span class="form-label">মোবাইল:</span>
            <span class="underline">${application.basicInformation?.cell1 || ''}</span>
        </div>
    </div>

    <table class="signature-table">
        <thead>
            <tr>
                <th>এজেন্ট</th>
                <th>পরিদর্শনকারী</th>
                <th>অনুমোদনকারী</th>
                <th>QC SWD</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="signature-cell">
                    ${application.verification?.agentUserId ? '✓ স্বাক্ষরিত' : ''}
                </td>
                <td class="signature-cell">
                    ${application.verification?.investigatorUserId ? '✓ স্বাক্ষরিত' : ''}
                </td>
                <td class="signature-cell">
                    ${application.verification?.authenticatorUserId ? '✓ স্বাক্ষরিত' : ''}
                </td>
                <td class="signature-cell">
                    ${application.verification?.qcSwdUserId ? '✓ স্বাক্ষরিত' : ''}
                </td>
            </tr>
        </tbody>
    </table>

    <div class="footer-note">
        <p>
            বিঃ দ্রঃ এতিমের অভিভাবকের, পিতার মৃত্যু সনদ ও অভিভাবকের জাতীয় পরিচয়পত্র আবশ্যক।
            পূর্ণ সত্য তথ্য প্রদান করতে হবে।
        </p>
        <p style="margin-top: 10px; font-size: 10px; color: #666;">
            Generated on: ${new Date().toLocaleDateString('bn-BD')} | Application ID: ${application.id}
        </p>
    </div>
</body>
</html>`;
  }
};
