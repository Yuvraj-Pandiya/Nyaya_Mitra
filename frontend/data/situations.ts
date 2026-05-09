import type { Situation } from '../types';

const situations: Situation[] = [
  {
    "id": "landlord-dispute",
    "category": "Housing",
    "icon": "Home",
    "title": {
      "en": "Landlord Dispute",
      "hi": "मकान मालिक विवाद"
    },
    "description": {
      "en": "Issues with your landlord including illegal eviction, deposit refusal, or uninhabitable conditions.",
      "hi": "मकान मालिक के साथ समस्याएं जैसे अवैध बेदखली, जमानत राशि न देना।"
    },
    "rights": [
      {
        "title": {
          "en": "Tenant Rights",
          "hi": "किरायेदार के अधिकार"
        },
        "description": {
          "en": "Protection from illegal eviction. Right to electricity and water. Privacy. Security deposit refund.",
          "hi": "अवैध बेदखली से सुरक्षा। बिजली और पानी का अधिकार। निजता। सुरक्षा जमा वापसी।"
        }
      },
      {
        "title": {
          "en": "Legal Remedies",
          "hi": "कानूनी उपाय"
        },
        "description": {
          "en": "Rent Control Court, Civil Court, Police complaint in case of threats, Legal notice.",
          "hi": "किराया नियंत्रण न्यायालय, व्यवहार न्यायालय, धमकी के मामले में पुलिस शिकायत, कानूनी नोटिस।"
        }
      }
    ],
    "laws": [
      {
        "section": "Constitutional Rights",
        "act": "Constitution of India",
        "summary": {
          "en": "Rights to life, shelter, equality, and property.",
          "hi": "जीवन, आश्रय, समानता और संपत्ति का अधिकार।"
        },
        "fullText": "Article 21: Protection of life and personal liberty - No person shall be deprived of his life or personal liberty except according to procedure established by law. (This includes the right to livelihood, shelter, and dignity).\n\nArticle 14: Equality before law - The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.\n\nArticle 19(1)(e): to reside and settle in any part of the territory of India.\n\nArticle 300A: Persons not to be deprived of property save by authority of law - No person shall be deprived of his property save by authority of law."
      }
    ],
    "checklist": [
      {
        "id": "ld1",
        "item": {
          "en": "Copy of rent agreement / lease deed",
          "hi": "किराया समझौते की प्रति"
        },
        "required": true
      },
      {
        "id": "ld2",
        "item": {
          "en": "Rent payment receipts (last 6 months)",
          "hi": "किराया रसीदें (पिछले 6 महीने)"
        },
        "required": true
      },
      {
        "id": "ld3",
        "item": {
          "en": "Security deposit payment proof",
          "hi": "सुरक्षा जमा प्रमाण"
        },
        "required": true
      },
      {
        "id": "ld4",
        "item": {
          "en": "Photos/videos of property condition",
          "hi": "संपत्ति की तस्वीरें/वीडियो"
        },
        "required": false
      },
      {
        "id": "ld5",
        "item": {
          "en": "Written communication with landlord",
          "hi": "मकान मालिक के साथ लिखित पत्राचार"
        },
        "required": false
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": {
          "en": "Send a Legal Notice",
          "hi": "कानूनी नोटिस भेजें"
        },
        "description": {
          "en": "Send a written notice to your landlord via registered post citing the specific grievance.",
          "hi": "अपने मकान मालिक को रजिस्टर्ड डाक से लिखित नोटिस भेजें।"
        },
        "tip": {
          "en": "Keep the postal receipt as proof of delivery.",
          "hi": "डाक रसीद रखें।"
        }
      },
      {
        "stepNumber": 2,
        "title": {
          "en": "File with Rent Authority",
          "hi": "किराया प्राधिकरण में शिकायत दर्ज करें"
        },
        "description": {
          "en": "File a complaint with your local Rent Controller or District Court.",
          "hi": "स्थानीय किराया नियंत्रक या जिला न्यायालय में शिकायत दर्ज करें।"
        },
        "tip": {
          "en": "Attach all documents from the checklist.",
          "hi": "चेकलिस्ट के सभी दस्तावेज संलग्न करें।"
        }
      },
      {
        "stepNumber": 3,
        "title": {
          "en": "Seek Legal Aid",
          "hi": "कानूनी सहायता लें"
        },
        "description": {
          "en": "Contact the District Legal Services Authority (DLSA) for free legal aid.",
          "hi": "जिला कानूनी सेवा प्राधिकरण से संपर्क करें।"
        },
        "tip": {
          "en": "DLSA services are free for BPL families.",
          "hi": "DLSA सेवाएं BPL परिवारों के लिए मुफ्त हैं।"
        }
      }
    ],
    "templateType": "complaint"
  },
  {
    "id": "consumer-complaint",
    "category": "Consumer Rights",
    "icon": "ShoppingBag",
    "title": {
      "en": "Consumer Complaint",
      "hi": "उपभोक्ता शिकायत"
    },
    "description": {
      "en": "Defective products, unfair trade practices, service deficiency, or overcharging.",
      "hi": "दोषपूर्ण उत्पाद, अनुचित व्यापार प्रथाएं, सेवा में कमी।"
    },
    "rights": [
      {
        "title": {
          "en": "Right to Safety",
          "hi": "सुरक्षा का अधिकार"
        },
        "description": {
          "en": "Protection against goods or services that are hazardous to life, health, or property.",
          "hi": "जीवन, स्वास्थ्य या संपत्ति के लिए खतरनाक वस्तुओं या सेवाओं के खिलाफ सुरक्षा।"
        }
      },
      {
        "title": {
          "en": "Right to be Informed",
          "hi": "सूचित होने का अधिकार"
        },
        "description": {
          "en": "Complete, truthful information about quality, quantity, price, standard, warranty, expiry, risks, terms & conditions.",
          "hi": "गुणवत्ता, मात्रा, कीमत, मानक, वारंटी आदि के बारे में पूर्ण जानकारी।"
        }
      },
      {
        "title": {
          "en": "Right to Choose",
          "hi": "चुनने का अधिकार"
        },
        "description": {
          "en": "Free choice of products/services at fair prices without coercion.",
          "hi": "बिना किसी दबाव के उचित मूल्य पर उत्पादों/सेवाओं का स्वतंत्र विकल्प।"
        }
      },
      {
        "title": {
          "en": "Right to be Heard",
          "hi": "सुने जाने का अधिकार"
        },
        "description": {
          "en": "Consumers’ interests must be considered at appropriate forums and disputes may be heard by Consumer Disputes Redressal Commissions.",
          "hi": "उपभोक्ताओं के हितों पर विचार किया जाना चाहिए।"
        }
      },
      {
        "title": {
          "en": "Right to Seek Redressal",
          "hi": "निवारण मांगने का अधिकार"
        },
        "description": {
          "en": "Consumers can seek compensation, refund, replacement, repair or corrective action for defective goods, service deficiency.",
          "hi": "उपभोक्ता मुआवजे, धनवापसी, प्रतिस्थापन, मरम्मत या सुधारात्मक कार्रवाई की मांग कर सकते हैं।"
        }
      },
      {
        "title": {
          "en": "Right to Consumer Awareness",
          "hi": "उपभोक्ता जागरूकता का अधिकार"
        },
        "description": {
          "en": "Authorities must promote awareness of consumer rights and legal remedies.",
          "hi": "अधिकारियों को उपभोक्ता अधिकारों और कानूनी उपचारों के बारे में जागरूकता को बढ़ावा देना चाहिए।"
        }
      }
    ],
    "laws": [
      {
        "section": "Rules & Scope",
        "act": "Consumer Protection Act, 2019",
        "summary": {
          "en": "Procedure: A complaint may be filed with the Consumer Disputes Redressal Commission within jurisdiction, electronically or in person, accompanied by requisite fee.",
          "hi": "प्रक्रिया: एक शिकायत उपभोक्ता विवाद निवारण आयोग में दायर की जा सकती है।"
        },
        "fullText": "Section 2(9) of Consumer Protection Act 2019 defines 'consumer rights' to include:\n(i) the right to be protected against the marketing of goods, products or services which are hazardous to life and property;\n(ii) the right to be informed about the quality, quantity, potency, purity, standard and price of goods, products or services, as the case may be, so as to protect the consumer against unfair trade practices;\n(iii) the right to be assured, wherever possible, access to a variety of goods, products or services at competitive prices;\n(iv) the right to be heard and to be assured that consumers' interests will receive due consideration at appropriate fora;\n(v) the right to seek redressal against unfair trade practice or restrictive trade practices or unscrupulous exploitation of consumers; and\n(vi) the right to consumer awareness."
      }
    ],
    "checklist": [
      {
        "id": "cc1",
        "item": {
          "en": "Copy of the Bill / Invoice / Cash Memo",
          "hi": "बिल / चालान / नकद मेमो की प्रति"
        },
        "required": true
      },
      {
        "id": "cc2",
        "item": {
          "en": "Product / Service details & deficiency description",
          "hi": "उत्पाद विवरण और सेवा में कमी का विवरण"
        },
        "required": true
      },
      {
        "id": "cc3",
        "item": {
          "en": "Copy of representation/complaint sent to the company",
          "hi": "कंपनी को भेजी गई शिकायत की प्रति"
        },
        "required": true
      },
      {
        "id": "cc4",
        "item": {
          "en": "Proof of delivery of the complaint (Email/Postal receipt)",
          "hi": "शिकायत की डिलीवरी का प्रमाण (ईमेल/डाक रसीद)"
        },
        "required": true
      },
      {
        "id": "cc5",
        "item": {
          "en": "Legal Notice sent (if any) and its proof of service",
          "hi": "भेजा गया कानूनी नोटिस और उसकी सेवा का प्रमाण"
        },
        "required": false
      },
      {
        "id": "cc6",
        "item": {
          "en": "Company's response or refusal letter (if any)",
          "hi": "कंपनी की प्रतिक्रिया या अस्वीकृति पत्र"
        },
        "required": false
      },
      {
        "id": "cc7",
        "item": {
          "en": "Photographs or videos of the defective goods",
          "hi": "दोषपूर्ण सामान की तस्वीरें या वीडियो"
        },
        "required": false
      },
      {
        "id": "cc8",
        "item": {
          "en": "Aadhar Card / ID Proof of the complainant",
          "hi": "शिकायतकर्ता का आधार कार्ड / पहचान प्रमाण"
        },
        "required": true
      },
      {
        "id": "cc9",
        "item": {
          "en": "Draft of the Notarized Affidavit verifying facts",
          "hi": "तथ्यों को सत्यापित करने वाला नोटरीकृत शपथ पत्र का प्रारूप"
        },
        "required": true
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": {
          "en": "Complain to the Business",
          "hi": "व्यापार से शिकायत करें"
        },
        "description": {
          "en": "Write to the company customer service. Give them 30 days to respond.",
          "hi": "कंपनी की ग्राहक सेवा को लिखें। उन्हें 30 दिन दें।"
        },
        "tip": {
          "en": "Always communicate in writing.",
          "hi": "हमेशा लिखित रूप में संवाद करें।"
        }
      },
      {
        "stepNumber": 2,
        "title": {
          "en": "File with Consumer Forum",
          "hi": "उपभोक्ता मंच में दर्ज करें"
        },
        "description": {
          "en": "File at the District Consumer Disputes Redressal Commission. No lawyer required.",
          "hi": "जिला उपभोक्ता विवाद निवारण आयोग में शिकायत दर्ज करें।"
        },
        "tip": {
          "en": "File online at consumerhelpline.gov.in",
          "hi": "consumerhelpline.gov.in पर ऑनलाइन दर्ज करें।"
        }
      },
      {
        "stepNumber": 3,
        "title": {
          "en": "Call NCH Helpline",
          "hi": "NCH हेल्पलाइन पर कॉल करें"
        },
        "description": {
          "en": "Call 1915 (National Consumer Helpline) for guidance before formal filing.",
          "hi": "औपचारिक दाखिल करने से पहले 1915 पर कॉल करें।"
        },
        "tip": {
          "en": "NCH is available in multiple languages.",
          "hi": "NCH कई भाषाओं में उपलब्ध है।"
        }
      }
    ],
    "templateType": "consumer"
  },
  {
    "id": "workplace-harassment",
    "category": "Employment",
    "icon": "Briefcase",
    "title": {
      "en": "Workplace Harassment",
      "hi": "कार्यस्थल उत्पीड़न"
    },
    "description": {
      "en": "Sexual harassment, bullying, wrongful termination, or discrimination at your workplace.",
      "hi": "कार्यस्थल पर यौन उत्पीड़न, धमकाना, गलत बर्खास्तगी।"
    },
    "rights": [
      {
        "title": {
          "en": "Complaint Timeline & Procedure",
          "hi": "शिकायत समय-सीमा और प्रक्रिया"
        },
        "description": {
          "en": "A complaint can be filed to the ICC within 90 days of the last incident.",
          "hi": "अंतिम घटना के 90 दिनों के भीतर शिकायत दर्ज की जा सकती है।"
        }
      },
      {
        "title": {
          "en": "ICC Inquiry",
          "hi": "ICC जांच"
        },
        "description": {
          "en": "The ICC must conduct a confidential inquiry and complete it within 90 days, with interim relief where warranted.",
          "hi": "ICC को गोपनीय जांच करनी चाहिए और 90 दिनों के भीतर पूरी करनी चाहिए।"
        }
      },
      {
        "title": {
          "en": "Criminal Charges",
          "hi": "आपराधिक आरोप"
        },
        "description": {
          "en": "Victims may also pursue criminal charges (e.g., under IPC sections like 354A) and file an FIR in addition to ICC complaint.",
          "hi": "पीड़ित ICC शिकायत के अतिरिक्त FIR भी दर्ज करा सकते हैं।"
        }
      }
    ],
    "laws": [
      {
        "section": "Mandatory Requirement",
        "act": "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act)",
        "summary": {
          "en": "Every employer with 10 or more employees must constitute an Internal Complaints Committee (ICC).",
          "hi": "10 या अधिक कर्मचारियों वाले प्रत्येक नियोक्ता को आंतरिक शिकायत समिति (ICC) का गठन करना होगा।"
        },
        "fullText": "Section 3 of POSH Act 2013: Prevention of sexual harassment.— (1) No woman shall be subjected to sexual harassment at any workplace. (2) The following circumstances, among other circumstances, if it occurs, or is present in relation to or connected with any act or behaviour of sexual harassment may amount to sexual harassment:— (i) implied or explicit promise of preferential treatment in her employment; or (ii) implied or explicit threat of detrimental treatment in her employment; or (iii) implied or explicit threat about her present or future employment status; or (iv) interference with her work or creating an intimidating or offensive or hostile work environment for her; or (v) humiliating treatment likely to affect her health or safety."
      }
    ],
    "checklist": [
      {
        "id": "wh1",
        "item": {
          "en": "Written account of incidents with dates",
          "hi": "तारीखों के साथ घटनाओं का विवरण"
        },
        "required": true
      },
      {
        "id": "wh2",
        "item": {
          "en": "Written/electronic evidence (emails, messages)",
          "hi": "ईमेल, संदेश जैसे साक्ष्य"
        },
        "required": false
      },
      {
        "id": "wh3",
        "item": {
          "en": "Witness names and contact details",
          "hi": "गवाहों के नाम और संपर्क"
        },
        "required": false
      },
      {
        "id": "wh4",
        "item": {
          "en": "Employment contract / offer letter",
          "hi": "रोजगार अनुबंध / ऑफर लेटर"
        },
        "required": true
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": {
          "en": "Document Everything",
          "hi": "सब कुछ दस्तावेज़ करें"
        },
        "description": {
          "en": "Keep a written record of all incidents with dates. Save all relevant communications.",
          "hi": "तारीखों के साथ सभी घटनाओं का लिखित रिकॉर्ड रखें।"
        },
        "tip": {
          "en": "Store evidence on personal device, not company systems.",
          "hi": "व्यक्तिगत डिवाइस में साक्ष्य रखें।"
        }
      },
      {
        "stepNumber": 2,
        "title": {
          "en": "File ICC Complaint",
          "hi": "ICC शिकायत दर्ज करें"
        },
        "description": {
          "en": "Submit written complaint to your organization ICC within 3 months. If no ICC, approach Local Complaints Committee.",
          "hi": "3 महीने के भीतर ICC को लिखित शिकायत दें।"
        },
        "tip": {
          "en": "Request acknowledgment receipt.",
          "hi": "रसीद मांगें।"
        }
      },
      {
        "stepNumber": 3,
        "title": {
          "en": "Approach Labour Court",
          "hi": "श्रम न्यायालय जाएं"
        },
        "description": {
          "en": "If ICC ruling is unsatisfactory, appeal to the Labour Court or High Court.",
          "hi": "यदि ICC निर्णय असंतोषजनक हो तो श्रम न्यायालय में अपील करें।"
        },
        "tip": {
          "en": "You may be entitled to interim relief during proceedings.",
          "hi": "कार्यवाही के दौरान अंतरिम राहत मिल सकती है।"
        }
      }
    ],
    "templateType": "complaint"
  },
  {
    "id": "fir-filing",
    "category": "Criminal",
    "icon": "Shield",
    "title": {
      "en": "FIR Filing",
      "hi": "FIR दर्ज करना"
    },
    "description": {
      "en": "How to file a First Information Report (FIR) with police for cognizable offences.",
      "hi": "संज्ञेय अपराधों के लिए FIR कैसे दर्ज करें।"
    },
    "rights": [
      {
        "title": {
          "en": "Right to File FIR",
          "hi": "FIR दर्ज करने का अधिकार"
        },
        "description": {
          "en": "Every citizen has the right to file a First Information Report (FIR) with the police for any cognizable offence.",
          "hi": "प्रत्येक नागरिक को संज्ञेय अपराध के लिए FIR दर्ज करने का अधिकार है।"
        }
      },
      {
        "title": {
          "en": "Obligations of Police",
          "hi": "पुलिस के दायित्व"
        },
        "description": {
          "en": "Police must record FIR for information regarding a cognizable offence.",
          "hi": "पुलिस को संज्ञेय अपराध के संबंध में FIR दर्ज करनी चाहिए।"
        }
      }
    ],
    "laws": [
      {
        "section": "Section 154",
        "act": "Code of Criminal Procedure (CrPC)",
        "summary": {
          "en": "Every citizen has the right to file a First Information Report (FIR) with the police for any cognizable offence (e.g., theft, assault, fraud, kidnapping, violence).",
          "hi": "प्रत्येक नागरिक को किसी भी संज्ञेय अपराध के लिए पुलिस में प्रथम सूचना रिपोर्ट (FIR) दर्ज करने का अधिकार है।"
        },
        "fullText": "Section 154 of the Code of Criminal Procedure, 1973 (now Section 173 of Bharatiya Nagarik Suraksha Sanhita, 2023): Information in cognizable cases.—\n(1) Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer in such form as the State Government may prescribe in this behalf.\n(2) A copy of the information as recorded under sub-section (1) shall be given forthwith, free of cost, to the informant."
      }
    ],
    "checklist": [
      {
        "id": "fir1",
        "item": {
          "en": "Personal identification proof (Aadhaar/Voter ID)",
          "hi": "पहचान प्रमाण (आधार/मतदाता पहचान पत्र)"
        },
        "required": true
      },
      {
        "id": "fir2",
        "item": {
          "en": "Written complaint with incident details",
          "hi": "घटना विवरण के साथ लिखित शिकायत"
        },
        "required": true
      },
      {
        "id": "fir3",
        "item": {
          "en": "Date, time and place of incident",
          "hi": "घटना की तारीख, समय और स्थान"
        },
        "required": true
      },
      {
        "id": "fir4",
        "item": {
          "en": "Names of accused (if known)",
          "hi": "आरोपियों के नाम (यदि ज्ञात हो)"
        },
        "required": false
      },
      {
        "id": "fir5",
        "item": {
          "en": "Any physical evidence or photographs",
          "hi": "भौतिक साक्ष्य या तस्वीरें"
        },
        "required": false
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": {
          "en": "Visit the Police Station",
          "hi": "पुलिस स्टेशन जाएं"
        },
        "description": {
          "en": "Go to the police station having jurisdiction over where the crime occurred. e-FIR is also available online in many states.",
          "hi": "उस क्षेत्र के पुलिस स्टेशन पर जाएं जहां अपराध हुआ।"
        },
        "tip": {
          "en": "If police refuse, approach Superintendent of Police or Magistrate u/s 156(3).",
          "hi": "यदि पुलिस मना करे तो SP या मजिस्ट्रेट के पास जाएं।"
        }
      },
      {
        "stepNumber": 2,
        "title": {
          "en": "Give Your Statement",
          "hi": "अपना बयान दें"
        },
        "description": {
          "en": "The officer will record your statement. Read carefully before signing.",
          "hi": "अधिकारी आपका बयान दर्ज करेगा। हस्ताक्षर से पहले ध्यान से पढ़ें।"
        },
        "tip": {
          "en": "Never sign a blank or incomplete FIR.",
          "hi": "अधूरी FIR पर कभी हस्ताक्षर न करें।"
        }
      },
      {
        "stepNumber": 3,
        "title": {
          "en": "Collect FIR Copy",
          "hi": "FIR प्रति लें"
        },
        "description": {
          "en": "Demand and collect a signed copy of the FIR. Note the FIR number for tracking.",
          "hi": "FIR की हस्ताक्षरित प्रति लें। FIR नंबर नोट करें।"
        },
        "tip": {
          "en": "Track case status on state police portal using FIR number.",
          "hi": "FIR नंबर से पुलिस पोर्टल पर ट्रैक करें।"
        }
      }
    ],
    "templateType": "complaint"
  },
  {
    "id": "rti-application",
    "category": "Government",
    "icon": "FileText",
    "title": {
      "en": "RTI Application",
      "hi": "RTI आवेदन"
    },
    "description": {
      "en": "File a Right to Information application to get information from government offices.",
      "hi": "सरकारी कार्यालयों से जानकारी पाने के लिए RTI आवेदन दर्ज करें।"
    },
    "rights": [
      {
        "title": {
          "en": "Procedure",
          "hi": "प्रक्रिया"
        },
        "description": {
          "en": "File RTI to the PIO with details of information sought.",
          "hi": "PIO के पास RTI दाखिल करें।"
        }
      },
      {
        "title": {
          "en": "Response Time",
          "hi": "प्रतिक्रिया समय"
        },
        "description": {
          "en": "Public authority must respond within 30 days (or 48 hours if life/death involved).",
          "hi": "सार्वजनिक प्राधिकरण को 30 दिनों के भीतर जवाब देना चाहिए।"
        }
      },
      {
        "title": {
          "en": "Appeals",
          "hi": "अपील"
        },
        "description": {
          "en": "If denied, file First Appeal then Second Appeal to Central/State Information Commission.",
          "hi": "इनकार किए जाने पर, केंद्रीय/राज्य सूचना आयोग में अपील दाखिल करें।"
        }
      }
    ],
    "laws": [
      {
        "section": "Section 3 & 6",
        "act": "Right to Information Act, 2005 (RTI Act)",
        "summary": {
          "en": "Every citizen has the right to access information held by public authorities to promote transparency and accountability.",
          "hi": "प्रत्येक नागरिक को सार्वजनिक प्राधिकरणों द्वारा रखी गई जानकारी तक पहुंचने का अधिकार है।"
        },
        "fullText": "Section 3 of RTI Act, 2005: Right to information.—Subject to the provisions of this Act, all citizens shall have the right to information.\n\nSection 6: Request for obtaining information.—(1) A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means in English or Hindi or in the official language of the area in which the application is being made, accompanying such fee as may be prescribed, to— (a) the Central Public Information Officer or State Public Information Officer, as the case may be, of the concerned public authority; (b) the Central Assistant Public Information Officer or State Assistant Public Information Officer, as the case may be, specifying the particulars of the information sought by him or her."
      }
    ],
    "checklist": [
      {
        "id": "rti1",
        "item": {
          "en": "Clearly stated information request",
          "hi": "स्पष्ट सूचना अनुरोध"
        },
        "required": true
      },
      {
        "id": "rti2",
        "item": {
          "en": "Rs. 10 fee (IPO / DD / Online)",
          "hi": "10 रुपये शुल्क"
        },
        "required": true
      },
      {
        "id": "rti3",
        "item": {
          "en": "Applicant name and address",
          "hi": "आवेदक का नाम और पता"
        },
        "required": true
      },
      {
        "id": "rti4",
        "item": {
          "en": "Name of the Public Authority (Department)",
          "hi": "सार्वजनिक प्राधिकरण का नाम"
        },
        "required": true
      },
      {
        "id": "rti5",
        "item": {
          "en": "BPL certificate (for fee waiver)",
          "hi": "BPL प्रमाण पत्र (शुल्क छूट के लिए)"
        },
        "required": false
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": {
          "en": "Draft Your Application",
          "hi": "आवेदन तैयार करें"
        },
        "description": {
          "en": "Write a clear application to the Public Information Officer (PIO) with specific questions.",
          "hi": "PIO को विशिष्ट प्रश्नों के साथ स्पष्ट आवेदन लिखें।"
        },
        "tip": {
          "en": "Keep questions specific and factual.",
          "hi": "प्रश्न विशिष्ट और तथ्यात्मक रखें।"
        }
      },
      {
        "stepNumber": 2,
        "title": {
          "en": "Submit and Pay Fee",
          "hi": "जमा करें और शुल्क दें"
        },
        "description": {
          "en": "Submit by post, in person, or online at rtionline.gov.in. Pay Rs. 10 fee (free for BPL).",
          "hi": "rtionline.gov.in पर ऑनलाइन या डाक से जमा करें।"
        },
        "tip": {
          "en": "Online RTI at rtionline.gov.in is fastest.",
          "hi": "ऑनलाइन RTI सबसे तेज है।"
        }
      },
      {
        "stepNumber": 3,
        "title": {
          "en": "Track and Follow Up",
          "hi": "ट्रैक करें"
        },
        "description": {
          "en": "Await response within 30 days. If unsatisfied, file first appeal with First Appellate Authority.",
          "hi": "30 दिनों का इंतजार करें। असंतुष्ट होने पर पहली अपील दाखिल करें।"
        },
        "tip": {
          "en": "Second appeal before Information Commission is also available.",
          "hi": "सूचना आयोग के सामने दूसरी अपील भी उपलब्ध है।"
        }
      }
    ],
    "templateType": "rti"
  },
  {
    "id": "domestic-violence",
    "category": "Family",
    "icon": "HeartHandshake",
    "title": {
      "en": "Domestic Violence",
      "hi": "घरेलू हिंसा"
    },
    "description": {
      "en": "Physical, emotional, or financial abuse by a spouse, partner, or family member.",
      "hi": "पति/पत्नी या परिवार द्वारा शारीरिक, भावनात्मक या वित्तीय दुर्व्यवहार।"
    },
    "rights": [
      {
        "title": {
          "en": "Protection against Abuse",
          "hi": "दुर्व्यवहार के खिलाफ सुरक्षा"
        },
        "description": {
          "en": "Women have the right to protection from physical, emotional, verbal, sexual, and economic abuse.",
          "hi": "महिलाओं को शारीरिक, भावनात्मक, मौखिक, यौन और आर्थिक शोषण से सुरक्षा का अधिकार है।"
        }
      },
      {
        "title": {
          "en": "Procedure",
          "hi": "प्रक्रिया"
        },
        "description": {
          "en": "Complaint may be filed to Protection Officer / Judicial Magistrate. Magistrate may grant interim protection, residency rights, monetary compensation and counseling. Police assistance can be sought to enforce orders.",
          "hi": "संरक्षण अधिकारी / न्यायिक मजिस्ट्रेट को शिकायत दर्ज की जा सकती है।"
        }
      }
    ],
    "laws": [
      {
        "section": "Section 3 & 12",
        "act": "Protection of Women from Domestic Violence Act, 2005 (PWDVA)",
        "summary": {
          "en": "Women have the right to protection from physical, emotional, verbal, sexual, and economic abuse by family or intimate partners.",
          "hi": "महिलाओं को परिवार या अंतरंग भागीदारों द्वारा शारीरिक, भावनात्मक, मौखिक, यौन और आर्थिक शोषण से सुरक्षा का अधिकार है।"
        },
        "fullText": "Section 3 of PWDVA, 2005: Definition of domestic violence.—For the purposes of this Act, any act, omission or commission or conduct of the respondent shall constitute domestic violence in case it— (a) harms or injures or endangers the health, safety, life, limb or well-being, whether mental or physical, of the aggrieved person or tends to do so and includes causing physical abuse, sexual abuse, verbal and emotional abuse and economic abuse; or (b) harasses, harms, injures or endangers the aggrieved person with a view to coerce her or any other person related to her to meet any unlawful demand for any dowry or other property or valuable security...\nSection 12 allows the aggrieved person to present an application to the Magistrate seeking one or more reliefs under this Act."
      }
    ],
    "checklist": [
      {
        "id": "dv1",
        "item": {
          "en": "Medical reports of any injuries",
          "hi": "चोटों की चिकित्सा रिपोर्ट"
        },
        "required": false
      },
      {
        "id": "dv2",
        "item": {
          "en": "Photographs of injuries or property damage",
          "hi": "चोटों की तस्वीरें"
        },
        "required": false
      },
      {
        "id": "dv3",
        "item": {
          "en": "Written account of incidents with dates",
          "hi": "तारीखों के साथ घटनाओं का विवरण"
        },
        "required": true
      },
      {
        "id": "dv4",
        "item": {
          "en": "Proof of residence",
          "hi": "निवास का प्रमाण"
        },
        "required": true
      },
      {
        "id": "dv5",
        "item": {
          "en": "Witness contact information",
          "hi": "गवाह की संपर्क जानकारी"
        },
        "required": false
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": {
          "en": "Contact Protection Officer",
          "hi": "संरक्षण अधिकारी से संपर्क करें"
        },
        "description": {
          "en": "Contact the Protection Officer (PO) in your district. They will help you file and access support.",
          "hi": "अपने जिले में संरक्षण अधिकारी से संपर्क करें।"
        },
        "tip": {
          "en": "Call Women Helpline 181 or Police 100 in emergency.",
          "hi": "आपात स्थिति में महिला हेल्पलाइन 181 या पुलिस 100 पर कॉल करें।"
        }
      },
      {
        "stepNumber": 2,
        "title": {
          "en": "File for Protection Order",
          "hi": "सुरक्षा आदेश के लिए आवेदन करें"
        },
        "description": {
          "en": "File Form I application before the Magistrate through the Protection Officer. You can also file directly.",
          "hi": "संरक्षण अधिकारी के माध्यम से मजिस्ट्रेट के सामने आवेदन दाखिल करें।"
        },
        "tip": {
          "en": "Filing is free. No court fee required.",
          "hi": "दाखिल करना निःशुल्क है।"
        }
      },
      {
        "stepNumber": 3,
        "title": {
          "en": "Seek Shelter if Needed",
          "hi": "आश्रय लें"
        },
        "description": {
          "en": "Government Shelter Homes (Swadhar Greh) provide free temporary housing. Protection Officer can help.",
          "hi": "स्वाधार गृह अस्थायी आवास प्रदान करते हैं।"
        },
        "tip": {
          "en": "Shelter Home stay is free and confidential.",
          "hi": "रहना निःशुल्क और गोपनीय है।"
        }
      }
    ],
    "templateType": "complaint"
  },
  {
    "id": "property-dispute",
    "category": "Property",
    "icon": "Landmark",
    "title": {
      "en": "Property Dispute",
      "hi": "संपत्ति विवाद"
    },
    "description": {
      "en": "Disputes over land ownership, inheritance, boundary, or illegal encroachment.",
      "hi": "भूमि स्वामित्व, विरासत, सीमा या अवैध कब्जे पर विवाद।"
    },
    "rights": [
      {
        "title": {
          "en": "Right to Property",
          "hi": "संपत्ति का अधिकार"
        },
        "description": {
          "en": "A citizen has the right to own, use, transfer and enjoy property as per contract and law.",
          "hi": "नागरिक को संपत्ति का अधिकार है।"
        }
      },
      {
        "title": {
          "en": "Registered Documents",
          "hi": "पंजीकृत दस्तावेज"
        },
        "description": {
          "en": "Registered documents are prima facie evidence of the transaction.",
          "hi": "पंजीकृत दस्तावेज लेनदेन के मुख्य साक्ष्य हैं।"
        }
      },
      {
        "title": {
          "en": "Civil Court Jurisdiction",
          "hi": "दीवानी न्यायालय क्षेत्राधिकार"
        },
        "description": {
          "en": "Civil Courts have jurisdiction to adjudicate property suits; limitation periods apply for filing claims.",
          "hi": "दीवानी न्यायालयों को संपत्ति विवादों का फैसला करने का अधिकार है।"
        }
      }
    ],
    "laws": [
      {
        "section": "Transfer & Registration",
        "act": "Transfer of Property Act, 1882; Indian Succession Act; Registration Act, 1908; Limitation Act",
        "summary": {
          "en": "A citizen has the right to own, use, transfer and enjoy property as per contract and law.",
          "hi": "एक नागरिक को संपत्ति के स्वामित्व, उपयोग, और हस्तांतरण का अधिकार है।"
        },
        "fullText": "Section 5 of Transfer of Property Act, 1882: 'Transfer of property' defined.—In the following sections 'transfer of property' means an act by which a living person conveys property, in present or in future, to one or more other living persons, or to himself, or to himself and one or more other living persons; and 'to transfer property' is to perform such act.\n\nSection 17 of the Registration Act, 1908: Documents of which registration is compulsory.—(1) The following documents shall be registered: (a) instruments of gift of immovable property; (b) other non-testamentary instruments which purport or operate to create, declare, assign, limit or extinguish, whether in present or in future, any right, title or interest, whether vested or contingent, of the value of one hundred rupees and upwards, to or in immovable property."
      }
    ],
    "checklist": [
      {
        "id": "pd1",
        "item": {
          "en": "Title deed / Sale deed",
          "hi": "शीर्षक विलेख / बिक्री विलेख"
        },
        "required": true
      },
      {
        "id": "pd2",
        "item": {
          "en": "Khata / Revenue records (Khasra, Khatauni)",
          "hi": "खाता / राजस्व अभिलेख"
        },
        "required": true
      },
      {
        "id": "pd3",
        "item": {
          "en": "Encumbrance certificate",
          "hi": "भार प्रमाण पत्र"
        },
        "required": true
      },
      {
        "id": "pd4",
        "item": {
          "en": "Property tax receipts",
          "hi": "संपत्ति कर रसीदें"
        },
        "required": false
      },
      {
        "id": "pd5",
        "item": {
          "en": "Survey / measurement reports",
          "hi": "सर्वेक्षण रिपोर्ट"
        },
        "required": false
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": {
          "en": "Verify Land Records",
          "hi": "भूमि अभिलेख सत्यापित करें"
        },
        "description": {
          "en": "Obtain certified copies of all land records from district revenue office.",
          "hi": "जिला राजस्व कार्यालय से भूमि अभिलेखों की प्रमाणित प्रतियां प्राप्त करें।"
        },
        "tip": {
          "en": "Most states have online land record portals (Bhulekh, Dharani).",
          "hi": "अधिकांश राज्यों में भूलेख पोर्टल हैं।"
        }
      },
      {
        "stepNumber": 2,
        "title": {
          "en": "Issue Legal Notice",
          "hi": "कानूनी नोटिस दें"
        },
        "description": {
          "en": "Send a legal notice to the encroacher via registered post demanding removal within 15 days.",
          "hi": "अतिक्रमणकर्ता को रजिस्टर्ड डाक से कानूनी नोटिस भेजें।"
        },
        "tip": {
          "en": "A lawyer-drafted notice carries more weight.",
          "hi": "वकील द्वारा तैयार नोटिस का अधिक प्रभाव होता है।"
        }
      },
      {
        "stepNumber": 3,
        "title": {
          "en": "File Civil Suit",
          "hi": "दीवानी मुकदमा दर्ज करें"
        },
        "description": {
          "en": "File a civil suit for declaration of title and permanent injunction in civil court.",
          "hi": "सिविल कोर्ट में स्वामित्व की घोषणा के लिए दीवानी मुकदमा दर्ज करें।"
        },
        "tip": {
          "en": "You can seek interim injunction to prevent further encroachment during trial.",
          "hi": "मुकदमे के दौरान अंतरिम निषेधाज्ञा मांग सकते हैं।"
        }
      }
    ],
    "templateType": "complaint"
  },
  {
    "id": "labor-rights",
    "category": "Employment",
    "icon": "Briefcase",
    "title": {
      "en": "Labor Rights / Wage Theft",
      "hi": "श्रमिक अधिकार / वेतन चोरी"
    },
    "description": {
      "en": "Unpaid wages, illegal deductions, denial of PF/ESI, wrongful termination, or unfair working conditions.",
      "hi": "अवैतनिक मजदूरी, अवैध कटौती, PF/ESI से इनकार, गलत बर्खास्तगी या अनुचित कार्य स्थिति।"
    },
    "rights": [
      {
        "title": {
          "en": "Dispute Resolution",
          "hi": "विवाद समाधान"
        },
        "description": {
          "en": "Labour issues can be taken before Labour Courts, Industrial Tribunals, District Forums or appropriate statutory bodies.",
          "hi": "श्रम मुद्दों को श्रम न्यायालयों, औद्योगिक न्यायाधिकरणों आदि के समक्ष ले जाया जा सकता है।"
        }
      }
    ],
    "laws": [
      {
        "section": "Key Rights & Laws",
        "act": "Industrial Disputes Act, Minimum Wages Act, Payment of Wages Act, Employees' Provident Funds Act, Workmen's Compensation Act, Shops & Establishments Acts",
        "summary": {
          "en": "Right to fair wages, timely payment, social security, compensation, and against unfair labour practices.",
          "hi": "उचित वेतन, समय पर भुगतान, सामाजिक सुरक्षा, और अनुचित श्रम प्रथाओं के खिलाफ अधिकार।"
        },
        "fullText": "Section 12 of Minimum Wages Act, 1948: Payment of minimum rates of wages.—(1) Where in respect of any scheduled employment a notification under section 5 is in force, the employer shall pay to every employee engaged in a scheduled employment under him wages at a rate not less than the minimum rate of wages fixed by such notification for that class of employees in that employment without any deductions except as may be authorized within such time and subject to such conditions as may be prescribed.\n\nSection 5 of Payment of Wages Act, 1936: Time of payment of wages.—(1) The wages of every person employed upon or in—(a) any railway, factory or industrial or other establishment upon or in which less than one thousand persons are employed, shall be paid before the expiry of the seventh day."
      }
    ],
    "checklist": [
      {
        "id": "lr1",
        "item": {
          "en": "Appointment letter / Offer letter",
          "hi": "नियुक्ति पत्र / ऑफर लेटर"
        },
        "required": true
      },
      {
        "id": "lr2",
        "item": {
          "en": "Salary slips for the period of dispute",
          "hi": "विवाद की अवधि की वेतन पर्चियां"
        },
        "required": true
      },
      {
        "id": "lr3",
        "item": {
          "en": "Bank statements showing salary credits (or lack thereof)",
          "hi": "बैंक विवरण जिसमें वेतन क्रेडिट दिखे"
        },
        "required": true
      },
      {
        "id": "lr4",
        "item": {
          "en": "PF account statement (EPFO UAN portal)",
          "hi": "PF खाता विवरण (EPFO UAN पोर्टल)"
        },
        "required": false
      },
      {
        "id": "lr5",
        "item": {
          "en": "Written communication / emails about wage dispute",
          "hi": "वेतन विवाद के बारे में लिखित पत्राचार / ईमेल"
        },
        "required": false
      },
      {
        "id": "lr6",
        "item": {
          "en": "Attendance records / proof of work done",
          "hi": "उपस्थिति रिकॉर्ड / कार्य का प्रमाण"
        },
        "required": true
      },
      {
        "id": "lr7",
        "item": {
          "en": "Termination letter (if employment ended)",
          "hi": "बर्खास्तगी पत्र (यदि नौकरी समाप्त हो गई)"
        },
        "required": false
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": {
          "en": "Calculate Dues and Document",
          "hi": "बकाया की गणना करें"
        },
        "description": {
          "en": "Calculate the exact amount of unpaid wages, illegal deductions, or PF dues. Make a written record.",
          "hi": "अवैतनिक मजदूरी, अवैध कटौती या PF बकाया की सटीक राशि की गणना करें।"
        },
        "tip": {
          "en": "Keep copies of all payslips and bank statements as primary evidence.",
          "hi": "प्राथमिक साक्ष्य के रूप में सभी वेतन पर्चियों और बैंक विवरणों की प्रति रखें।"
        }
      },
      {
        "stepNumber": 2,
        "title": {
          "en": "Send Written Demand to Employer",
          "hi": "नियोक्ता को लिखित मांग भेजें"
        },
        "description": {
          "en": "Send a written demand notice to your employer via registered post, stating the exact amount due and giving 15 days to pay.",
          "hi": "नियोक्ता को रजिस्टर्ड डाक से लिखित मांग नोटिस भेजें।"
        },
        "tip": {
          "en": "Always keep the postal receipt as proof the notice was sent.",
          "hi": "डाक रसीद हमेशा रखें।"
        }
      },
      {
        "stepNumber": 3,
        "title": {
          "en": "File Complaint with Labour Inspector",
          "hi": "श्रम निरीक्षक को शिकायत दर्ज करें"
        },
        "description": {
          "en": "Visit your district Labour Office and file a complaint with the Labour Inspector under the Payment of Wages Act or Minimum Wages Act.",
          "hi": "जिला श्रम कार्यालय में जाएं और श्रम निरीक्षक को शिकायत दर्ज करें।"
        },
        "tip": {
          "en": "Labour Inspector has powers to examine records and penalize employers.",
          "hi": "श्रम निरीक्षक के पास रिकॉर्ड जांचने और नियोक्ता को दंड देने का अधिकार है।"
        }
      },
      {
        "stepNumber": 4,
        "title": {
          "en": "Approach Labour Court",
          "hi": "श्रम न्यायालय जाएं"
        },
        "description": {
          "en": "If Labour Inspector fails to resolve, file a claim application before the Labour Court or Industrial Tribunal for recovery of wages.",
          "hi": "यदि श्रम निरीक्षक समाधान न करें, तो श्रम न्यायालय में दावा दर्ज करें।"
        },
        "tip": {
          "en": "Free legal aid is available for workers through State Legal Services Authority.",
          "hi": "राज्य विधिक सेवा प्राधिकरण के माध्यम से श्रमिकों को मुफ्त कानूनी सहायता उपलब्ध है।"
        }
      },
      {
        "stepNumber": 5,
        "title": {
          "en": "File EPF Grievance Online",
          "hi": "EPF शिकायत ऑनलाइन दर्ज करें"
        },
        "description": {
          "en": "For PF-related issues, file grievance at epfigms.gov.in or call EPFO toll-free 1800-118-005.",
          "hi": "PF से संबंधित समस्याओं के लिए epfigms.gov.in पर शिकायत दर्ज करें।"
        },
        "tip": {
          "en": "EPFO can directly penalize employers for PF defaults under Section 14B EPF Act.",
          "hi": "EPFO EPF अधिनियम की धारा 14B के तहत नियोक्ताओं को सीधे दंड दे सकता है।"
        }
      }
    ],
    "templateType": "complaint"
  }
];

export default situations;
