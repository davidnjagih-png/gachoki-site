/*
  Starting content. Facts come from the Parliament of Kenya member page.
  Anything in [square brackets] is a placeholder to replace in /admin.
  Once Firebase is connected, the dashboard takes over and this file is
  only the fallback for fields that have never been saved.
*/
import site from "../../site.config.js";

export const DEFAULT_SETTINGS = {
  name: site.name,
  title: site.title,
  role: site.role,
  area: site.area,
  party: "UDA",
  theme: { ...site.theme },
  intro:
    "Member of Parliament for Kirinyaga Central and a surveyor by training. First elected in 2011, he returned to the National Assembly in 2022 and sits on the Lands and Regional Integration committees.",
  basedIn: "Kirinyaga County",
  focus: ["Lands", "Foreign missions"],
  heroImage: "",
  wideImage: "",
  wideQuote: "",
  stats: [
    { value: "34,074", label: "Votes at the 2022 election" },
    { value: "2011", label: "First elected, Kirinyaga Central" },
    { value: "2", label: "Current committees" },
    { value: "1998", label: "Began career as a surveyor" },
  ],
  career: [
    { years: "2022 – Present", role: "Member of Parliament", org: "National Assembly, Kirinyaga Central", note: "Member of the Lands Committee and the Regional Integration Committee. Elected with 34,074 votes." },
    { years: "2018 – 2022", role: "Chief Executive Officer", org: "GEO Acre Surveys Ltd", note: "" },
    { years: "2011 – 2017", role: "Member of Parliament", org: "National Assembly, Kirinyaga Central", note: "Elected in the February 2011 by-election. Served on the Committee on Implementation, the Defence and Foreign Relations Committee, and as Vice Chairperson of the Committee on Delegated Legislation." },
    { years: "1998 – 2011", role: "Chief Surveyor", org: "GEO Acre Surveys Ltd", note: "" },
  ],
  education: [
    { years: "1992 – 1997", what: "BSc Surveying", where: "University of Nairobi" },
    { years: "1986 – 1989", what: "KCSE", where: "Kamuiru Boys" },
  ],
  committees: [
    "Lands Committee (Member, current)",
    "Regional Integration Committee (Member, current)",
    "Committee on Implementation (Member, 2011–2013)",
    "Departmental Committee on Defence and Foreign Relations (Member, 2013–2017)",
    "Committee on Delegated Legislation (Vice Chairperson, 2013–2017)",
  ],
  affiliations: ["Institution of Surveys of Kenya", "Association of Licensed Surveyors"],
  careerIntro: "From the survey field to the National Assembly.",
  visionIntro: "",
  pillars: [],
  pledge: "",
  contact: { address: "NG-CDF Office, Kerugoya, Kirinyaga Central", phone: "", email: "", hours: "" },
  socials: {
    facebook: "https://www.facebook.com/p/Eng-Gachoki-Gitari-100069464615696/",
    x: "https://x.com/mp_gitari",
    instagram: "",
    youtube: "",
  },
};

export const CATEGORIES = ["Lands", "Infrastructure", "Education", "Health", "Water", "Legislation", "Community", "Other"];
export const PRESS_KINDS = ["Article", "Interview", "Video", "Statement", "Hansard"];
export const ALBUMS = ["Community", "Projects", "Parliament", "Events"];

export const SAMPLE_PROJECTS = [
  ["Lands", "[Project name]", "[Ward]", "[Year]", "[00%]", "[Measured outcome]"],
  ["Infrastructure", "[Project name]", "[Ward]", "[Year]", "[0,000]", "[Measured outcome]"],
  ["Education", "[Project name]", "[Ward]", "[Year]", "[00]", "[Measured outcome]"],
  ["Legislation", "[Bill or motion title]", "National Assembly", "[Year]", "[Status]", "[Where it stands]"],
].map(([category, title, place, year, result, resultLabel], i) => ({
  id: `sample-project-${i}`, category, title, place, year, result, resultLabel, order: i, image: "", url: "",
  summary: "[One line on the problem and what changed.]",
}));

export const SAMPLE_PRESS = ["Article", "Interview", "Video"].map((kind, i) => ({
  id: `sample-press-${i}`, kind, title: "[Headline or title]", outlet: "[Outlet]", date: "", url: "", image: "",
  summary: "[One line on what the piece covers.]",
}));

export const SAMPLE_GALLERY = Array.from({ length: 8 }, (_, i) => ({
  id: `sample-gallery-${i}`, image: "", caption: "[Event] · [Place]", category: ALBUMS[i % ALBUMS.length], order: i,
}));
