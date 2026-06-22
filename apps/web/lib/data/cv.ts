/**
 * Curriculum Vitae data for Bandu Manamperi
 * TODO: Replace this with CMS/database queries when implementing backend
 */

export interface CVEntry {
    year: string;
    title: string;
    subtitle?: string;
}

export interface CVCollection {
    name: string;
}

export interface CVData {
    education: CVEntry[];
    workExperienceCurrent: CVEntry[];
    workExperiencePast: CVEntry[];
    soloExhibitions: CVEntry[];
    groupExhibitions: CVEntry[];
    workshopsResidencies: CVEntry[];
    invitedLectures: CVEntry[];
    awards: CVEntry[];
    publicCollections: CVCollection[];
}

export const cvData: CVData = {
    education: [
        {
            year: "2024",
            title: "Advanced Stone Conservation Programme — UNESCO",
        },
        {
            year: "2013",
            title: "Certificate in Conservation of Cultural Property (Murals & Paintings)",
        },
        {
            year: "2004",
            title: "M.A. in Archaeology (studies commenced)",
            subtitle: "Postgraduate Institute of Archaeology, University of Kelaniya, Sri Lanka",
        },
        {
            year: "2002",
            title: "Postgraduate Diploma in Archaeology (Merit)",
            subtitle: "Postgraduate Institute of Archaeology, University of Kelaniya, Sri Lanka",
        },
        {
            year: "2000",
            title: "Bachelor of Fine Arts — BFA (Sculpture)",
            subtitle: "Institute of Aesthetic Studies, University of Kelaniya, Sri Lanka",
        },
    ],

    workExperienceCurrent: [
        {
            year: "Present",
            title: "Vice Chairman / Founding Member",
            subtitle: "Theertha International Artists' Collective & Red Dot Gallery, Colombo",
        },
        {
            year: "Present",
            title: "Co-Founder & Director",
            subtitle: "Colombo Performance Art Platform (co-founded with Dr. G. R. Constantine)",
        },
        {
            year: "2020–Present",
            title: "Member — Colombo Resource Panel 'Our Stories' Project",
            subtitle: "The Asia Foundation in collaboration with Theertha",
        },
        {
            year: "2005–Present",
            title: "Chief Coordinator — Travelling Art Education Exhibition",
            subtitle: "Theertha International Artists' Collective (curated by Prof. Jagath Weerasinghe)",
        },
        {
            year: "2015–present",
            title: "Supervisor, undergraduate students on thesis related to performance art and visual art in Sri Lanka",
        },
        {
            year: "2013–present",
            title: "Lecturing in Museology, Diploma in Museology course",
            subtitle: "Postgraduate Institute of Archaeology, Colombo, Sri Lanka",
        },
    ],

    workExperiencePast: [
        {
            year: "2010–2014",
            title: "Research Administrator for Prof. Jagath Weerasinghe — Sethu Samuddram Community Art Project",
            subtitle: "Theertha International Artists Collective of Sri Lanka and 1ShanthiRoad artists' organization, Bangalore, India",
        },
        {
            year: "2010–2014",
            title: "Chief Coordinator, Chief Project Manager and Training Instructor — Let's Take a Walk Contemporary Art Project",
            subtitle: "Theertha International Artists' Collective, Sri Lanka",
        },
        {
            year: "2002–2014",
            title: "Resource person for Art Teacher Training Workshops — Theertha ArtLab",
            subtitle: "In collaboration with Zonal Education Offices in Dehiattakandiya, Kegalle, Aludeniya, Kandy, Samanthurai, Akkaraipattu, Kalmunei, Polonnaruwa, Anuradhapura",
        },
        {
            year: "2007–2013",
            title: "Chief project manager and teacher training instructor — Art as a Third Channel project",
            subtitle: "In collaboration with Zonal Education Offices in Matara, Balangoda, Kandy, Akurassa",
        },
        {
            year: "2007–2010",
            title: "Chief Coordinator — \"Ape Gam Palatha\" (In Our Village Area) project",
            subtitle: "Theertha International Artists' Collective, curated by Prof. Jagath Weerasinghe, Colombo, Sri Lanka",
        },
        {
            year: "2007–2009",
            title: "Consultant on stone carving and sculptures",
            subtitle: "Star Granite, Minuwangoda, Sri Lanka",
        },
        {
            year: "2010",
            title: "Teacher and trainer, one-week workshop — Theertha International Women Artists' Residency 2009",
            subtitle: "Participants from India, Malaysia, Nepal, Sri Lanka",
        },
        {
            year: "2008",
            title: "Chief Coordinator, Chief Project Manager and Training Instructor — \"Ape Gama\" and \"Ape Gampalatha\" Contemporary Art Project",
            subtitle: "Theertha International Artists' Collective, Sri Lanka",
        },
        {
            year: "2008",
            title: "Consultant for wood carving workshop at Sigiriya Craft village, Sigiriya",
            subtitle: "Organized by National Craft Council",
        },
        {
            year: "2007",
            title: "Lecturer for 2nd year students — Modeling, casting and plaster carving",
            subtitle: "Plymouth College of Art and Design, UK",
        },
        {
            year: "2006",
            title: "Working committee member, Theertha International Artists' Workshop – 2006",
            subtitle: "Kandy, Sri Lanka",
        },
        {
            year: "2005",
            title: "Curator panel member — \"Sri Lankan Visual Art, 20th Century\" Traveling Exhibition",
            subtitle: "Under chief curator Prof. Jagath Weerasinghe, organized by Theertha Artists' Collective, Sri Lanka",
        },
        {
            year: "2004",
            title: "Coordinator, Jaffna Exhibition Project",
            subtitle: "Theertha International Artists' Collective, Colombo, Sri Lanka",
        },
        {
            year: "2003",
            title: "Asst. Coordinator / Workshop Manager, Theertha International Artists' Workshop 2003",
            subtitle: "Beruwala, Sri Lanka",
        },
        {
            year: "2003",
            title: "Asst. Coordinator of art & craft projects",
            subtitle: "Theertha International Artists' Collective, Colombo, Sri Lanka",
        },
        {
            year: "2002–2003",
            title: "Art teacher",
            subtitle: "Vidyarathana University College, Horana, Sri Lanka",
        },
    ],

    soloExhibitions: [
        {
            year: "2026",
            title: "'Studio Finds: Rediscovered & Reimagined'",
            subtitle: "Art Rhizome, Colombo, Sri Lanka",
        },
        {
            year: "2009",
            title: "'Numbed'",
            subtitle: "Red Dot Gallery, Pitakotte, Sri Lanka",
        },
    ],

    groupExhibitions: [
        {
            year: "2026",
            title: "'A Contemporary Convergence' — Group Exhibition curated by Suresh Dominic",
            subtitle: "Curado Art Space, Colombo, Sri Lanka (19–31 March 2026)",
        },
        {
            year: "2025",
            title: "'NOSTOS' — Group Exhibition",
            subtitle: "The Barefoot Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2024–2025",
            title: "'Total Landscaping' (Rotation 3)",
            subtitle: "Museum of Modern and Contemporary Art Sri Lanka (MMCA), Colombo. Public programming supported by Nations Trust Bank",
        },
        {
            year: "2023",
            title: "'Antibodies' — 24-hour Performance Marathon",
            subtitle: "HH Art Spaces & The Tetley, Leeds, supported by British Council; Aguada Central Jail, Goa, India (17–18 March 2023)",
        },
        {
            year: "2022",
            title: "'The Smell' — 4th Theertha Performance Platform",
            subtitle: "Theertha Red Dot Gallery, Sri Lanka",
        },
        {
            year: "2022",
            title: "'The Black History' — International Print Exhibition",
            subtitle: "Printmaking Gallery",
        },
        {
            year: "2020",
            title: "Iran-India 2020, 'Performance Art Project: Asia'",
            subtitle: "Rah Art Residence / hexxy duxxy box, via Zoom",
        },
        {
            year: "2020",
            title: "'A Theertha Interim Show'",
            subtitle: "Theertha Red Dot Gallery, Borella, Colombo, Sri Lanka",
        },
        {
            year: "2020",
            title: "'OBLAK Performances, Objects & Vulnerability' — online via Zoom",
            subtitle: "Performed at Borella Junction",
        },
        {
            year: "2019–2020",
            title: "'One Hundred Thousand Small Tales'",
            subtitle: "Museum of Modern and Contemporary Art Sri Lanka (MMCA), Colombo (Dec 2019 – Aug 2020)",
        },
        {
            year: "2019",
            title: "'Texting Being' — Theertha Performance Platform 2019",
            subtitle: "Theertha, Borella, Sri Lanka",
        },
        {
            year: "2019",
            title: "'A Cross Section' — Group Exhibition of Sri Lankan Artists",
            subtitle: "Jaleh Gallery, Tehran, Iran",
        },
        {
            year: "2019",
            title: "'Contemporary Sri Lankan Art: A Cross-Section'",
            subtitle: "Iranian Cultural Centre, Colombo, Sri Lanka",
        },
        {
            year: "2018",
            title: "'One Hundred Thousand Small Tales' — 4th Dhaka Art Summit",
            subtitle: "Bangladesh Shilpakala Academy, Dhaka, Bangladesh (curated by Sharmini Pereira, organised by Samdani Art Foundation)",
        },
        {
            year: "2017",
            title: "'A Tale of Two Cities | India and Sri Lanka'",
            subtitle: "Theertha Red Dot Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2017",
            title: "ART CONNECT — Colombo Fashion Week 2017",
            subtitle: "Colombo, Sri Lanka",
        },
        {
            year: "2017",
            title: "'Portraits of Intervention: Contemporary Art from Sri Lanka'",
            subtitle: "Aicon Gallery, New York, USA",
        },
        {
            year: "2017",
            title: "'Life and Time — The Changing Landscape'",
            subtitle: "Academy of Fine Arts, Kolkata, India",
        },
        {
            year: "2017",
            title: "Theertha Performance Platform",
            subtitle: "Theertha Red Dot Gallery, Borella, Colombo, Sri Lanka",
        },
        {
            year: "2017",
            title: "'A Tale of Two Cities | India and Sri Lanka'",
            subtitle: "IGNCA, New Delhi, India",
        },
        {
            year: "2016",
            title: "'A Tale of Two Cities | India and Sri Lanka'",
            subtitle: "Serendipity Arts Festival, Adil Shah Palace, Goa, India",
        },
        {
            year: "2016",
            title: "'Washing Man' — performance, OPEN 6, curated by Nikhil Chopra",
            subtitle: "Open Studio Residency, The Heritage Hotel: Art Spaces, Goa, India",
        },
        {
            year: "2016",
            title: "'Iron Man' — performance",
            subtitle: "India Art Fair, New Delhi, India",
        },
        {
            year: "2016",
            title: "'Reading The Biography' — performance with G.R. Constantine",
            subtitle: "Theertha Performance Evening, Colombo, Sri Lanka",
        },
        {
            year: "2016",
            title: "'Developing Land' — performance",
            subtitle: "Theertha Performance Evening, Colombo, Sri Lanka",
        },
        {
            year: "2016",
            title: "'Washing Man' — performance, Down Town Pulse 2016",
            subtitle: "Bakeriya Space, Colombo",
        },
        {
            year: "2015",
            title: "'Dead Fish' — performance",
            subtitle: "Theertha Performance Platform 1st Edition, Sri Lanka",
        },
        {
            year: "2014",
            title: "'Me and My Image' — performance with Godwin Constantine",
            subtitle: "'Transforming Bodies', Colombo Dance Platform 2014",
        },
        {
            year: "2014",
            title: "'Serendipity Revealed: An Exhibition of Contemporary Sri Lankan Art'",
            subtitle: "Brunei Gallery, SOAS, London, UK",
        },
        {
            year: "2014",
            title: "'Beware Wet Ink' — Digital Art Exhibition",
            subtitle: "Lionel Wendt Gallery, Colombo",
        },
        {
            year: "2014",
            title: "Dhaka Art Summit",
            subtitle: "Dhaka, Bangladesh",
        },
        {
            year: "2014",
            title: "'Making History' — Colombo Art Biennale, curated by Amit Jain",
        },
        {
            year: "2013",
            title: "'Golden Barrel Man' (2nd performance) — 'WAR & PEACE: Visual Narratives from Contemporary Sri Lanka'",
            subtitle: "Harold Pieris Gallery, Colombo",
        },
        {
            year: "2012",
            title: "'Becoming' — 2nd Colombo Art Biennale, curated by Suresh Jayaram & Roman Berka",
        },
        {
            year: "2011",
            title: "'Crushing Eggs' — Live Art 2011",
            subtitle: "Bangalore Artists' Residency, India",
        },
        {
            year: "2011",
            title: "Sethu Residency 2 Exhibition",
            subtitle: "Theertha Red Dot Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2011",
            title: "'Beyond Pressure' Performance Art Festival",
            subtitle: "Myanmar",
        },
        {
            year: "2011",
            title: "'(de)-inscribed Memories' — Group Exhibition with Pradeep Chandrasiri",
            subtitle: "Hempel Galleries, Colombo",
        },
        {
            year: "2011",
            title: "Theertha @ 1.Shanthi Road",
            subtitle: "Bangalore, India",
        },
        {
            year: "2011",
            title: "Sethu Residency 1 — Shanthi Road @ Theertha 2010",
            subtitle: "Red Dot Gallery, Colombo",
        },
        {
            year: "2009",
            title: "'Imagining Peace' — 1st Colombo Art Biennale",
            subtitle: "Curated by Prof. Jagath Weerasinghe & Annoushka Hampel, Sri Lanka",
        },
        {
            year: "2009",
            title: "'Theertha — Works on Paper'",
            subtitle: "National Art Gallery, Maldives",
        },
        {
            year: "2009",
            title: "'PostcART'",
            subtitle: "Sudu Gallery, Galle, Sri Lanka",
        },
        {
            year: "2008",
            title: "International Artists' Residency Exhibition",
            subtitle: "Red Dot Gallery, Pitakotte, Sri Lanka",
        },
        {
            year: "2008",
            title: "'Artful Resistance'",
            subtitle: "Museum of Anthropology, Vienna, Austria",
        },
        {
            year: "2007",
            title: "'Buy 1 Get 1 Free' — HAT2 Programme",
            subtitle: "Plymouth College of Art and Design Gallery, UK",
        },
        {
            year: "2006",
            title: "'The Maze' — Collaborative Art Project",
            subtitle: "Lionel Wendt Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2005",
            title: "'Contemporary Sri Lankan Art'",
            subtitle: "Museum of Far Eastern Antiquities, Stockholm, Sweden",
        },
        {
            year: "2005",
            title: "'Urban and the Individual'",
            subtitle: "Fenominal Art Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2005",
            title: "'Aham Puram'",
            subtitle: "Theertha International Artists' Collective, Public Library, Jaffna, Sri Lanka",
        },
        {
            year: "2004",
            title: "'Exhibition of Paintings and Sculpture'",
            subtitle: "Gallery 71, Galle Fort, Galle, Sri Lanka",
        },
        {
            year: "2003",
            title: "'2nd Theertha International Artists' Workshop' Exhibition",
            subtitle: "Lunuganga Gardens, Beruwala, Sri Lanka",
        },
        {
            year: "2003",
            title: "'Chartered Theft'",
            subtitle: "VAFA Gallery, Ethul Kotte, Sri Lanka",
        },
        {
            year: "2002",
            title: "'Crafty Thoughts'",
            subtitle: "University of Liverpool Art Gallery, Liverpool, UK",
        },
        {
            year: "2001",
            title: "1st Theertha International Artists' Workshop",
            subtitle: "Gallery 706, Colombo, Sri Lanka",
        },
        {
            year: "2000",
            title: "4th Art Link International Artists' Workshop",
            subtitle: "Gallery 706, Colombo, Sri Lanka",
        },
        {
            year: "2000",
            title: "'An Art Exhibition for Peace and Reconciliation'",
            subtitle: "Gallery 706, Colombo, Sri Lanka",
        },
        {
            year: "2000",
            title: "'Made in IAS'",
            subtitle: "Gallery 706, Colombo, Sri Lanka",
        },
        {
            year: "2000",
            title: "'Artist for Peace' — Flag Exhibition",
            subtitle: "Selected Public Places, Sri Lanka",
        },
        {
            year: "1999",
            title: "'State Art Festival'",
            subtitle: "National Art Gallery, Colombo, Sri Lanka",
        },
        {
            year: "1999",
            title: "'Young Contemporaries'",
            subtitle: "National Art Gallery, Colombo, Sri Lanka",
        },
        {
            year: "1999",
            title: "'Nawa Kalakaruwo'",
            subtitle: "National Art Gallery, Colombo, Sri Lanka",
        },
        {
            year: "1999",
            title: "'The Sculpture of Contemporary Sri Lanka'",
            subtitle: "National Art Gallery, Colombo, Sri Lanka",
        },
        {
            year: "1998",
            title: "'New Directions'",
            subtitle: "Mount Castle Gallery, Colombo, Sri Lanka",
        },
        {
            year: "1998",
            title: "'Modern Painting, Sculpture and Installation'",
            subtitle: "Mahanaga Mandiraya, Humbantota, Sri Lanka",
        },
    ],

    workshopsResidencies: [
        {
            year: "2025",
            title: "Museum Intensive 3 (MI 3) — Integrated Pest Management & Archival Conservation Workshop",
            subtitle: "MMCA Sri Lanka, Colombo (10–11 March 2025). Conducted by Nicola Walker, Senior Conservator, National Trust UK; developed in partnership with World Monuments Fund",
        },
        {
            year: "2023",
            title: "Artist Delegate & Collaborator — 7th Arts Collaboratory Assembly",
            subtitle: "Netherlands (Utrecht, Amsterdam, Eindhoven). Represented Theertha International Artists' Collective",
        },
        {
            year: "2019",
            title: "Artist in Residence — Theertha",
            subtitle: "Colombo, Sri Lanka",
        },
        {
            year: "2017",
            title: "Venice International Performance Art Week",
            subtitle: "Venice, Italy",
        },
        {
            year: "2016",
            title: "Falls Creek Artist Camp",
            subtitle: "Melbourne, Australia",
        },
        {
            year: "2016",
            title: "David Thomas Art Space",
            subtitle: "Melbourne, Australia",
        },
        {
            year: "2016",
            title: "OPEN 6, Open Studio Residency",
            subtitle: "The Heritage Hotel: Art Spaces, Goa, India",
        },
        {
            year: "2015–ongoing",
            title: "Participant — The Tale of Two Cities 2015",
            subtitle: "One-year-long project for established artists of India and Sri Lanka, exploring Varanasi and Anuradhapura. Conceived by Renu Modi; sponsored by Espace Gallery, Theertha International Artists Collective and Serendipity Arts Trust",
        },
        {
            year: "2015",
            title: "Art Collaboratory Institutional Residency",
            subtitle: "Kunchi Cultural Studies Center, Yogyakarta, Indonesia",
        },
        {
            year: "2011",
            title: "Workshop in Art History: Buddhist Iconography — conducted by Dr. Nandana Chutiwongs",
            subtitle: "Postgraduate Institute of Archaeology (PGIAR), University of Kelaniya, Colombo",
        },
        {
            year: "2011",
            title: "Workshop in Art History: Sri Lanka and Burma in the wider Buddhist world — conducted by Dr. Donald Stadner",
            subtitle: "Former Associate Professor, University of Texas, Austin",
        },
        {
            year: "2010",
            title: "3rd Beyond Pressure Festival of Performance Art",
            subtitle: "Myanmar",
        },
        {
            year: "2010",
            title: "Theertha International Artists' Workshop",
            subtitle: "Colombo, Sri Lanka",
        },
        {
            year: "2008",
            title: "Landscape Drawing Workshop",
            subtitle: "Theertha International Artists' Collective Studio, Colombo",
        },
        {
            year: "2008",
            title: "International Artists' Residency",
            subtitle: "Theertha International Artists' Collective, Pitakotte, Sri Lanka",
        },
        {
            year: "2007",
            title: "Crafting the Drawing and Drawing the Craft",
            subtitle: "Theertha International Artists' Collective Studio, Colombo",
        },
        {
            year: "2007",
            title: "CHAT Week (HAT2 Programme)",
            subtitle: "Sanskriti Kendra, New Delhi, India",
        },
        {
            year: "2007",
            title: "HAT2 Programme: International Research Fellowship — Three months Residency",
            subtitle: "Plymouth College of Art and Design, UK",
        },
        {
            year: "2007",
            title: "Paper Casting Workshop",
            subtitle: "Sanskriti Kendra, New Delhi, India",
        },
        {
            year: "2003",
            title: "Burragorang International Artists' Workshop",
            subtitle: "New South Wales, Australia",
        },
        {
            year: "2003",
            title: "Art and Craft Workshop at Polonnaruwa",
            subtitle: "ArtLab, Colombo, Sri Lanka",
        },
        {
            year: "2002",
            title: "Peace Train Project",
            subtitle: "Vibavi Academy of Fine Arts, Ethulkotte, Sri Lanka",
        },
        {
            year: "2001",
            title: "1st Theertha International Artists' Workshop",
            subtitle: "Beruwala, Sri Lanka",
        },
        {
            year: "2000",
            title: "Art Link — 4th International Artists' Camp",
            subtitle: "Culture Club, Kandalama, Sri Lanka",
        },
        {
            year: "2000",
            title: "Artists for Peace (Street Flag Painting Project)",
            subtitle: "Fort Railway Station, Colombo, Sri Lanka",
        },
        {
            year: "2000",
            title: "Workshop with Sue Pedley",
            subtitle: "Lunuganga Gardens, Beruwala, Sri Lanka",
        },
        {
            year: "1999",
            title: "Workshop with Fiona Hall",
            subtitle: "Lunuganga Gardens, Beruwala, Sri Lanka",
        },
    ],

    invitedLectures: [
        {
            year: "2015",
            title: "Lecture and presentation on Performance Art and Photo Performance",
            subtitle: "City School of Architecture (partnering with University of the West of England, Bristol, UK) — for 1st year students",
        },
        {
            year: "2013",
            title: "Talk on \"Golden Barrel Man – Performance artwork by Bandu Manamperi\"",
            subtitle: "WAR & PEACE – Visual Narratives from contemporary Sri Lanka, Harold Pieris Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2011",
            title: "Lecture on \"The body as Language\"",
            subtitle: "Post Graduate Institute of Archaeology (PGIAR), Colombo, Sri Lanka",
        },
        {
            year: "2010",
            title: "Lecture on \"Sri Lankan Performance Art\"",
            subtitle: "German Culture Centre, Colombo — organized by Theertha International Artists' Collective, Pitakotte, Sri Lanka",
        },
        {
            year: "2010",
            title: "Symposium on \"Sri Lanka Performance Art\"",
            subtitle: "3rd Beyond Pressure Festival of Performance Art, Myanmar — Kargqwell Co-YIN KABAR Gallery",
        },
    ],

    awards: [
        // TODO: populate from CMS
    ],

    publicCollections: [
        // TODO: populate from CMS
    ],
};
