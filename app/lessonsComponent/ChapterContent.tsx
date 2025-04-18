import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageSourcePropType,
  Platform,
  FlatList,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/chapterContentStyles';

interface Section {
  title: string;
  content: string[];
  image?: ImageSourcePropType;
}

interface ChapterContent {
  sections: Section[];
}

// Define chapter content
const chapterContents: Record<string, ChapterContent> = {
  '1-1': {
    sections: [
      {
        title: 'Ce este o parolă și de ce este importantă?',
        content: [
          'O parolă este un cod secret pe care îl folosim pentru a proteja conturile noastre online. Este ca un gard invizibil care ține hoții departe de informațiile noastre personale.',
          'Imaginează-ți că parola ta este cheia casei tale. Dacă o faci prea simplă, oricine poate intra! Dar dacă e puternică, doar TU vei putea deschide ușa contului tău.',
        ],
        image: require('../../assets/images/lessons/Passwords comic.png'),
      },
      {
        title: 'Cum să îți faci o parolă SUPER SIGURĂ!',
        content: [
          '• Să fie LUNGĂ – cel puțin 8-12 caractere.',
          '• Să conțină litere mari și mici – "A" și "a" fac diferența.',
          '• Să includă cifre și simboluri – "P@ssw0rd!2024" este mai sigur decât "parola123".',
          '• Să fie ușor de reținut pentru tine, dar greu de ghicit pentru alții!',
        ],
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
          'NU spune nimănui parola ta! Nici măcar celui mai bun prieten.',
        ],
      },
      {
        title: 'Cum să NU îți faci parola',
        content: [
          '• Nu folosi parole scurte – "12345" sau "parola" sunt foarte ușor de ghicit!',
          '• Nu folosi numele tău sau data de naștere – Dacă cineva știe cum te cheamă, poate încerca asta.',
          '• Nu folosi aceeași parolă peste tot – Dacă cineva o află, îți poate accesa toate conturile!',
        ],
      },
    ],
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
          'Blochează persoana care te deranjează – Majoritatea platformelor au opțiunea de "block" sau "report".',
          '✅ Spune unui adult de încredere – Nu trebuie să treci singur prin asta! Părinții sau profesorii te pot ajuta.',
          '✅ Fii un prieten bun online – Nu distribui zvonuri și nu te alătura celor care jignesc pe altcineva!',
          '🌟 Regula de Aur: Dacă nu ai spune ceva unei persoane față în față, atunci nu o spune nici online!',
        ],
      },
    ],
  },
  '2-1': {
    sections: [
      {
        title: 'Cum știm că un site este sigur?',
        content: [
          'Un site sigur este ca un loc bine păzit, unde datele tale sunt protejate! 🔒',
        ],
      },
      {
        title: 'Semne că un site este SIGUR:',
        content: [
          '✅ Are un lacăt lângă adresa web 🔒 (ex: https://sitebun.ro)',
          '✅ Are o adresă care începe cu "https://" – "S" vine de la securitate!',
          '✅ Nu îți cere date personale fără motiv (de exemplu, nume, telefon, adresă)',
          '✅ Nu are reclame ciudate care îți cer să descarci ceva fără să vrei',
        ],
      },
      {
        title: 'Semne că un site este PERICULOS:',
        content: [
          '❌ Adresa începe cu "http://" fără "S"',
          '❌ Are multe reclame suspecte și ferestre care apar brusc (pop-up-uri)',
          '❌ Îți cere date personale fără un motiv clar',
          '❌ Are greșeli de scriere (ex: "Goooogle" în loc de "Google")',
        ],
      },
      {
        title: 'Truc:',
        content: [
          'Dacă un site pare suspect, roagă un adult să verifice înainte să dai click! 🔍',
        ],
      },
    ],
  },
  '2-2': {
    sections: [
      {
        title: 'Ce este un virus informatic?',
        content: [
          'Un virus informatic este un program rău care poate strica calculatorul sau telefonul tău. Este ca un microb invizibil care poate face haos! 😨',
        ],
      },
      {
        title: 'Cum ajung virușii pe dispozitivele noastre?',
        content: [
          '❌ Descărcăm jocuri și aplicații din surse nesigure 🕹️',
          '❌ Dăm click pe linkuri suspecte 📎',
          '❌ Deschidem email-uri de la persoane necunoscute 📧',
        ],
      },
      {
        title: 'Cum să ne protejăm?',
        content: [
          '✅ Instalăm un antivirus bun 🛡',
          '✅ Descărcăm aplicații doar din magazine oficiale (Google Play, App Store) 📲',
          '✅ Nu deschidem fișiere din email-uri necunoscute 🚫',
          '✅ Întrebăm un adult înainte de a instala ceva nou 🔍',
        ],
      },
      {
        title: 'Truc:',
        content: [
          'Dacă un site îți spune că "ai un virus" și trebuie să descarci ceva rapid, închide pagina imediat! 🚀',
        ],
      },
    ],
  },
  '2-3': {
    sections: [
      {
        title: 'Ce este phishing-ul?',
        content: [
          'Phishing-ul este o metodă prin care hackerii încearcă să te păcălească să le dai datele tale personale, cum ar fi parola sau numărul de telefon. 🎭',
        ],
      },
      {
        title: 'Cum arată o tentativă de phishing?',
        content: [
          '❌ Primești un email care spune că ai câștigat un premiu uriaș 🎁',
          '❌ Un mesaj îți cere să-ți schimbi parola urgent, deși nu ai cerut asta 🔑',
          '❌ Un site arată aproape identic cu unul real, dar are o adresă ciudată (ex: "faceb00k.com" în loc de "facebook.com") 🧐',
        ],
      },
      {
        title: 'Cum să NU cazi în capcană?',
        content: [
          '✅ Verifică mereu adresa site-ului înainte să introduci date 🔍',
          '✅ Nu da click pe linkuri suspecte trimise pe email 📩',
          '✅ Întreabă un adult dacă un mesaj pare dubios 📢',
        ],
      },
      {
        title: 'Truc:',
        content: [
          'Dacă un mesaj sună prea bine ca să fie adevărat ("Ai câștigat un iPhone 📱"), atunci probabil nu este adevărat!',
        ],
      },
    ],
  },
  '2-4': {
    sections: [
      {
        title: 'De ce nu toți oamenii online sunt cine spun că sunt?',
        content: [
          'Pe internet, oricine poate pretinde că este altcineva. O persoană care se dă drept copil poate fi, de fapt, un adult rău intenționat. 🚨',
        ],
      },
      {
        title: 'Semne că cineva nu este de încredere:',
        content: [
          '❌ Îți cere poze sau date personale rapid 📸',
          '❌ Vrea să vorbească doar în privat, fără să știe părinții tăi 🕵️‍♂️',
          '❌ Te presează să faci lucruri care nu îți plac 😨',
          '❌ Îți propune să vă întâlniți fără să îți spună clar cine este ❌',
        ],
      },
      {
        title: 'Cum să te protejezi?',
        content: [
          '✅ Nu vorbi cu străini online, la fel cum nu ai vorbi pe stradă! 🚦',
          '✅ Dacă cineva îți cere poze sau informații personale, spune unui adult! 📢',
          '✅ Blochează și raportează orice comportament ciudat 🛑',
        ],
      },
      {
        title: 'Regula de Aur:',
        content: [
          'Dacă nu ai vorbi cu acea persoană în viața reală, nu vorbi nici online!',
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
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    let isMounted = true;

    async function setOrientation(
      targetOrientation: ScreenOrientation.OrientationLock
    ) {
      if (!isMounted) return;

      try {
        await ScreenOrientation.lockAsync(targetOrientation);
      } catch (error) {
        console.warn('Orientation change failed:', error);
      }
    }

    // Initial orientation setup
    setOrientation(ScreenOrientation.OrientationLock.PORTRAIT);

    // Navigation listeners
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setOrientation(ScreenOrientation.OrientationLock.PORTRAIT);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setOrientation(ScreenOrientation.OrientationLock.PORTRAIT);
    });

    // Handle dimension changes
    const dimensionChangeListener = Dimensions.addEventListener('change', ({ window }) => {
      if (isMounted) {
        setDimensions(window);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeFocus();
      unsubscribeBlur();
      dimensionChangeListener.remove();
      setOrientation(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, [navigation]);

  // Get chapter content if available
  const chapterContent =
    chapterContents[chapterId as keyof typeof chapterContents];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={chapterContent ? chapterContent.sections : [{ title: 'Content', content: ['This is where you can add the actual content for each chapter. You can include text, images, videos, or interactive elements.'] }]}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <>
            <Text style={styles.title}>{title as string}</Text>
            <Text style={styles.description}>{description as string}</Text>
          </>
        )}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.content.map((paragraph, pIndex) => (
              <Text key={pIndex} style={styles.sectionText}>
                {paragraph}
              </Text>
            ))}
            {item.image && (
              <View style={styles.imageContainer}>
                <Image
                  source={item.image}
                  style={styles.sectionImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        )}
      />
    </>
  );
}

