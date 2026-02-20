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
            year: "2013",
            title: "Certificate Course in Conservation of Cultural Property (murals & paintings)",
        },
        {
            year: "2004",
            title: "MA in Archeology",
            subtitle: "Post Graduate Institute of Archeology, University of Kelaniya, Sri Lanka",
        },
        {
            year: "2002",
            title: "Post Graduate Diploma in Archeology (Merit)",
            subtitle: "Post Graduate Institute of Archeology, University of Kelaniya, Sri Lanka",
        },
        {
            year: "2000",
            title: "Bachelor of Fine Arts, BFA (Sculpture)",
            subtitle: "University of Visual and Performance Art, Colombo (formally Institute of Aesthetic Studies, University of Kelaniya), Sri Lanka",
        },
    ],

    workExperienceCurrent: [
        {
            year: "2000–present",
            title: "Founding Member",
            subtitle: "Theertha International Artists' Collective, Colombo, Sri Lanka",
        },
        {
            year: "2015–present",
            title: "Supervisor, undergraduate students on thesis related to performance art and visual art in Sri Lanka",
        },
        {
            year: "2013–present",
            title: "Lecturing in Museology, Diploma in Museology course",
            subtitle: "Postgraduate Institute of Archeology, Colombo, Sri Lanka",
        },
        {
            year: "2005–present",
            title: "Chief Coordinator and member of curatorial panel — Theertha International Artists' Collective's Traveling Art Education Exhibition on the history of 20th Century Sri Lankan Art",
            subtitle: "Curated and compiled by Prof. Jagath Weerasinghe, Colombo, Sri Lanka",
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
            year: "2009",
            title: "Numbed",
            subtitle: "Red Dot Gallery, Pitakotte, Sri Lanka",
        },
    ],

    groupExhibitions: [
        {
            year: "2016",
            title: "\"Reading The Biography\" — performance with G.R. Constantine",
            subtitle: "Theertha Performance Evening, Colombo, Sri Lanka",
        },
        {
            year: "2016",
            title: "\"Developing Land\" — performance",
            subtitle: "Theertha Performance Evening, Colombo, Sri Lanka",
        },
        {
            year: "2016",
            title: "\"Washing Man\" — performance, Down Town Pulse 2016",
            subtitle: "Bakeriya Space, Colombo",
        },
        {
            year: "2016",
            title: "\"Washing Man\" — performance, OPEN 6, curated by Nikhil Chopra",
            subtitle: "Open Studio Residency, The Heritage Hotel: Art Spaces, Goa, India",
        },
        {
            year: "2016",
            title: "\"Iron Man\" — performance",
            subtitle: "India Art Fair, New Delhi, India",
        },
        {
            year: "2015",
            title: "\"Dead Fish\" — performance",
            subtitle: "1st Theertha Performance Platform, Sri Lanka",
        },
        {
            year: "2014",
            title: "\"Me and My Image\" — performance with Godwin Constantine, curated by Anna Wagner",
            subtitle: "'Transforming Bodies' Colombo Dance Platform 2014",
        },
        {
            year: "2014",
            title: "Serendipity Revealed: an exhibition of contemporary Sri Lankan art",
            subtitle: "Brunei Gallery, SOAS, London, United Kingdom",
        },
        {
            year: "2014",
            title: "'Beware Wet Ink' — Digital Art Exhibition",
            subtitle: "Lionel Wendt Gallery",
        },
        {
            year: "2014",
            title: "'Making History' — Colombo Art Biennale, curated by Amit Jain",
        },
        {
            year: "2014",
            title: "\"Iron Man\" — performance",
            subtitle: "Dhaka Art Summit, Shilpakola Academy, Dhaka",
        },
        {
            year: "2014",
            title: "\"Iron Man\" — photo performance and performance based video, 3rd Colombo Art Biennale",
            subtitle: "Colombo, Sri Lanka",
        },
        {
            year: "2013",
            title: "Sethu Samurdram — group exhibition",
            subtitle: "Theertha Red Dot Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2012",
            title: "\"Golden Barrel Man\" (2nd performance) — WAR & PEACE: Visual Narratives from contemporary Sri Lanka",
            subtitle: "Harold Pieris Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2011",
            title: "\"Becoming\" — 2nd Colombo Art Biennale, curated by Suresh Jayaram and Roman Berka",
            subtitle: "Sri Lanka",
        },
        {
            year: "2011",
            title: "\"Crushing Eggs\" — performance, Live Art 2011",
            subtitle: "Bengaluru Artists Residency 1",
        },
        {
            year: "2011",
            title: "Sethu Residency 2 Exhibition @ Theertha 2011",
            subtitle: "Theertha Red Dot Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2011",
            title: "Beyond Pressure performance art festival",
            subtitle: "Myanmar — Golden Barrel Man & Window Shopping performances",
        },
        {
            year: "2011",
            title: "(de)-inscribed Memories — group exhibition [Pradeep Chandrasiri and Bandu Manamperi]",
            subtitle: "Hempel Galleries, Colombo, Sri Lanka",
        },
        {
            year: "2011",
            title: "theertha @1.shanthiroad",
            subtitle: "Bangalore, India",
        },
        {
            year: "2011",
            title: "Sethu Residency 1shanthi road @ theertha 2010",
            subtitle: "Red Dot Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2009",
            title: "Imagining Peace — 1st Colombo Art Biennale, curated by Prof. Jagath Weerasinghe and Annoushka Hempel",
            subtitle: "Sri Lanka — Illusive Space, performance with GR Constantine",
        },
        {
            year: "2009",
            title: "Works on Paper — group exhibition",
            subtitle: "National Art Gallery, Maldives — works by artists from Theertha International Artists Collective",
        },
        {
            year: "2009",
            title: "\"PostcART\"",
            subtitle: "Sudu Gallery, Galle, Sri Lanka",
        },
        {
            year: "2008",
            title: "International Artists Residency Exhibition",
            subtitle: "Red Dot Gallery, Pitakotte, Sri Lanka",
        },
        {
            year: "2008",
            title: "Artful Resistance",
            subtitle: "Museum of Anthropology, Vienna, Austria",
        },
        {
            year: "2007",
            title: "\"Buy 1 get 1 free\" — HAT2 Program",
            subtitle: "Plymouth College of Art and Design Gallery, UK",
        },
        {
            year: "2006",
            title: "\"The Maze\" — collaborative art project and performance with GR Constantine",
            subtitle: "Lionel Wendt Gallery, Colombo, Sri Lanka",
        },
        {
            year: "2005",
            title: "\"Contemporary Sri Lankan Art\"",
            subtitle: "Museum of Far Eastern Antiquities, Stockholm, Sweden",
        },
        {
            year: "2004",
            title: "\"Urban and the individual\"",
            subtitle: "Fenominal Art Gallery, Colombo, Sri Lanka",
        },
        {
            year: "1999",
            title: "\"State Art Festival\"",
            subtitle: "National Art Gallery, Colombo, Sri Lanka",
        },
        {
            year: "1999",
            title: "\"Young Contemporaries\"",
            subtitle: "National Art Gallery, Colombo, Sri Lanka",
        },
        {
            year: "1999",
            title: "\"Nawa Kalakaruwo\"",
            subtitle: "National Art Gallery, Colombo, Sri Lanka",
        },
        {
            year: "1999",
            title: "\"The Sculpture of Contemporary Sri Lanka\"",
            subtitle: "National Art Gallery, Colombo, Sri Lanka",
        },
        {
            year: "1998",
            title: "\"Modern Painting, Sculpture and Installation\"",
            subtitle: "Mahanaga Mandiraya, Humbantota, Sri Lanka",
        },
        {
            year: "1998",
            title: "\"New Directions\"",
            subtitle: "Mount Castle Gallery, Colombo, Sri Lanka",
        },
    ],

    workshopsResidencies: [
        {
            year: "2015–ongoing",
            title: "Participant — The Tale of Two Cities 2015",
            subtitle: "One-year-long project for established artists of India and Sri Lanka, exploring Varanasi and Anuradhapura. Conceived by Renu Modi; sponsored by Espace Gallery, Theertha International Artists Collective and Serendipity Arts Trust",
        },
        {
            year: "2016",
            title: "Theertha Performance Workshop",
            subtitle: "Theertha Performance Platform 2016",
        },
        {
            year: "2016",
            title: "OPEN 6, Open Studio Residency",
            subtitle: "The Heritage Hotel: Art Spaces, Goa, India",
        },
        {
            year: "2015",
            title: "Art Collaboratory Institutional Residency with Prof. Jagath Weerasinghe",
            subtitle: "Kunchi Cultural Studies Center, Yogyakarta, Indonesia",
        },
        {
            year: "2011",
            title: "Workshop in Art History: Buddhist Iconography — conducted by Dr. Nandana Chutiwongs",
            subtitle: "Postgraduate Institute of Archeology (PGIAR), University of Kelaniya, Colombo",
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
            year: "2010",
            title: "Landscape Drawing Workshop",
            subtitle: "Theertha International Artists Collective Studio, Colombo, Sri Lanka",
        },
        {
            year: "2010",
            title: "International Artists' Residency",
            subtitle: "Theertha International Artists Collective, Pitakotte, Sri Lanka",
        },
        {
            year: "2008",
            title: "Crafting the Drawing and Drawing the Craft — Drawing workshop",
            subtitle: "Theertha International Artists Collective Studio, Colombo, Sri Lanka",
        },
        {
            year: "2008",
            title: "CHAT Week, a component of the HAT2 Program",
            subtitle: "Sanskriti Kendra, New Delhi, India",
        },
        {
            year: "2007",
            title: "HAT2 Programme: International Research Fellowship — Three months Residency",
            subtitle: "Plymouth College of Art and Design, UK",
        },
        {
            year: "2007",
            title: "Training in Glass blowing and glass casing — HAT2 Programme",
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
            title: "Art and Craft workshop at Polonnaruwa",
            subtitle: "Organized by ArtLab, Colombo, Sri Lanka",
        },
        {
            year: "2002",
            title: "Peace Train Project",
            subtitle: "Organized by Vibhavi Academy of Fine Arts, Ethulkotte, Sri Lanka",
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
            title: "Artists for Peace — Street Flag Painting Project",
            subtitle: "Fort Railway Station, Colombo, Sri Lanka",
        },
        {
            year: "2000",
            title: "Workshop with Sue Pedley",
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
