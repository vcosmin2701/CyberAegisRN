import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Define chapter content
const chapterContents = {
  '1-1': {
    sections: [
      {
        title: 'Ce este o parolă și de ce este importantă?',
        content: [
          'O parolă este un cod secret pe care îl folosim pentru a proteja conturile noastre online. Este ca un gard invizibil care ține hoții departe de informațiile noastre personale.',
          'Imaginează-ți că parola ta este cheia casei tale. Dacă o faci prea simplă, oricine poate intra! Dar dacă e puternică, doar TU vei putea deschide ușa contului tău.'
        ]
      },
      {
        title: 'Cum să îți faci o parolă SUPER SIGURĂ!',
        content: [
          '• Să fie LUNGĂ – cel puțin 8-12 caractere.',
          '• Să conțină litere mari și mici – "A" și "a" fac diferența.',
          '• Să includă cifre și simboluri – "P@ssw0rd!2024" este mai sigur decât "parola123".',
          '• Să fie ușor de reținut pentru tine, dar greu de ghicit pentru alții!'
        ]
      },
      {
        title: 'Cum să-ți amintești parolele?',
        content: [
          '• Poți folosi o frază ușor de reținut, de exemplu:',
          '• "MereleVerzi!Sunt12Bune"',
          '• Nu scrie parola pe hârtie sau în telefon într-un loc ușor de găsit.',
          '• Nu împărtăși parola nimănui, nici măcar prietenilor!',
          '',
          'Truc: Folosește o propoziție pe care doar tu o știi!',
          'Exemplu: "ImiPlAcMereleVerzi!22" – Ușor de ținut minte, dar greu de ghicit!',
          'NU spune nimănui parola ta! Nici măcar celui mai bun prieten.'
        ]
      },
      {
        title: 'Cum să NU îți faci parola',
        content: [
          '• Nu folosi parole scurte – "12345" sau "parola" sunt foarte ușor de ghicit!',
          '• Nu folosi numele tău sau data de naștere – Dacă cineva știe cum te cheamă, poate încerca asta.',
          '• Nu folosi aceeași parolă peste tot – Dacă cineva o află, îți poate accesa toate conturile!'
        ]
      }
    ]
  },
  '1-2': {
    sections: [
      {
        title: 'Ce este o reclamă?',
        content: [
          'O reclamă este un anunț care îți arată ceva de cumpărat sau îți cere să dai click pe un link. Multe reclame sunt adevărate, dar unele sunt periculoase și vor să te păcălească!',
        ],
      },
      {
        title: 'Semne că o reclamă este FALSĂ',
        content: [
          '„Ai câștigat un telefon GRATUIT!” – Sună prea bine ca să fie adevărat? Atunci probabil nu este!',
          '„Click aici urgent, altfel pierzi premiul!” – Orice anunț care te grăbește este suspect.',
          'Are multe greșeli de scriere – „Felicitri! Ai câștigatt o vacanta!” 🤨',
          'Vine dintr-o sursă necunoscută – Dacă nu ai auzit niciodată de acel site, mai bine stai departe!',
        ],
      },
      {
        title: 'Cum să NU cazi în capcană?',
        content: [
          'Întreabă un adult – Dacă vezi ceva ciudat, roagă un părinte să verifice.',
          'Nu da click pe linkuri suspecte – Ele pot conține viruși care îți fură datele!',
          'Caută informația pe Google – Dacă premiul chiar există, sigur vor scrie și pe site-uri serioase.',
          'Exemplu: Dacă vezi o reclamă care spune „iPhone gratis! Doar azi!”, întreabă-te: „De ce mi-ar da cineva un iPhone fără să fac nimic?”',
        ],
      },
    ],
  },
  '1-3': {
    sections: [
      {
        title: 'Ce sunt datele personale?',
        content: [
          'Datele personale sunt informațiile despre tine pe care NU trebuie să le împărtășești cu oricine. Ele includ:',
          'Numele tău complet',
          'Adresa de acasă',
          'Școala la care înveți',
          'Numărul de telefon',
          'Poze cu tine',
          'Gândește-te la ele ca la un cufăr cu comori! Nu vrei să le lași la vedere pentru oricine!',
        ],
      },
      {
        title: 'Dacă un străin îți scrie online...',
        content: [
          'Ce trebuie să faci:',
          'Ignoră-l – Nu vorbi cu persoane necunoscute!',
          'Blochează-l – Majoritatea aplicațiilor au un buton special pentru asta.',
          'Spune unui adult – Un părinte sau un profesor poate verifica dacă e ceva periculos.',
          'Regula de Aur: Dacă nu ai vorbi cu acea persoană în realitate, de ce ai vorbi cu ea online?',
        ],
      },
      {
        title: 'Ce NU trebuie să spui străinilor online?',
        content: [
          'Dacă cineva te întreabă:',
          '„Cum te cheamă complet?”',
          '„Unde stai?”',
          '„Vrei să ne întâlnim?”',
          'NU răspunde și spune unui adult!',
        ],
      },
    ],
  },
  '1-4': {
    sections: [
      {
        title: 'Ce este cyberbullying-ul?',
        content: [
          'Cyberbullying înseamnă hărțuire online – când cineva spune lucruri urâte despre tine, te amenință sau te jignește pe internet. Acest lucru poate fi făcut prin:',
          'Mesaje răutăcioase trimise pe telefon sau pe internet 📱',
          'Comentarii urâte pe rețelele sociale 😠',
          'Răspândirea de zvonuri sau imagini jenante fără permisiunea ta 🚫',
          'Atenție! Cyberbullying-ul poate afecta emoțiile unei persoane și poate face pe cineva să se simtă trist sau speriat. Dar există soluții!',
        ],
      },
      {
        title: 'Cum să te protejezi de cyberbullying?',
        content: [
          'Nu răspunde la mesaje răutăcioase – Dacă răspunzi, situația poate deveni și mai rea.',
          'Fă capturi de ecran – Dacă cineva te hărțuiește online, păstrează dovezi.',
          'Blochează persoana care te deranjează – Majoritatea platformelor au opțiunea de „block” sau „report”.',
          '✅ Spune unui adult de încredere – Nu trebuie să treci singur prin asta! Părinții sau profesorii te pot ajuta.',
          '✅ Fii un prieten bun online – Nu distribui zvonuri și nu te alătura celor care jignesc pe altcineva!',
          '🌟 Regula de Aur: Dacă nu ai spune ceva unei persoane față în față, atunci nu o spune nici online!',
        ],
      },
    ],
  },
  // Add more chapter contents here as needed
};

export default function ChapterContent() {
  const params = useLocalSearchParams();
  const { id, title, description } = params;
  const chapterId = id as string;
  
  // Get chapter content if available
  const chapterContent = chapterContents[chapterId as keyof typeof chapterContents];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title as string}</Text>
        <Text style={styles.description}>{description as string}</Text>
        
        {chapterContent ? (
          // Display structured content if available
          chapterContent.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.content.map((paragraph, pIndex) => (
                <Text key={pIndex} style={styles.sectionText}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))
        ) : (
          // Default content if no specific content is available
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Content</Text>
            <Text style={styles.sectionText}>
              This is where you can add the actual content for each chapter.
              You can include text, images, videos, or interactive elements.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 8,
  },
}); 