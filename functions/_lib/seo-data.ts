export interface ServiceDef {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  intro: string;
  description: string;
  highlights: string[];
  faqs: { q: string; a: string }[];
}

export interface LocationDef {
  slug: string;
  name: string;
  region: string;
  country: string;
  description: string;
  harbours: string[];
  flavor: string;
  geo?: { lat: number; lng: number };
}

export const SERVICES: ServiceDef[] = [
  {
    slug: 'yacht-management',
    name: 'Yacht Management',
    shortName: 'Management',
    tagline: 'A shoreside office for the principal.',
    intro: 'Flag, finance, compliance, payroll, insurance and crew, handled by one office, one director, one telephone number.',
    description:
      'Aldridge & Charles operates as the principal\'s shoreside office. Day-to-day operations, accounts, insurance, regulatory filings, payroll, classification, and crew contracts are administered under retainer. The director on duty briefs the principal weekly, never daily, never by spreadsheet. The office holds the standing files: surveys, certifications, refit records, warranty positions, and the photograph library. When the vessel changes flag, the office handles it. When she changes class, the office handles it. When she changes captains, the office is on the phone before the resignation letter is dry.',
    highlights: [
      'Single shoreside director per principal, available by direct line',
      'Books reviewed annually by independent maritime counsel',
      'Flag and class advisory across the major registries',
      'Crew payroll and contracts in compliance with MLC 2006',
      'Insurance brokered through long-standing Lloyd\'s placements',
      'Quarterly written report to the principal, never a portal login',
    ],
    faqs: [
      {
        q: 'How is yacht management billed?',
        a: 'By retainer, on annual contract, paid quarterly in advance. The retainer covers the office, the director, and routine compliance. Out-of-pocket project costs (refit, brokerage, registration changes) are billed separately at cost, with all receipts shared.',
      },
      {
        q: 'Will the office hold delegated authority to act?',
        a: 'Yes, where the principal grants it in writing. Most engagements include a limited power of attorney for routine class, flag, port, and customs filings, and a separate signing authority for vendor invoices below an agreed threshold. Everything above is presented for approval.',
      },
      {
        q: 'Can you manage a vessel we already own?',
        a: 'Yes. The first thirty days are a handover: file audit, standing crew interviews, class and flag review, insurance benchmark. By day forty the office has a complete picture and a written transition plan.',
      },
    ],
  },
  {
    slug: 'brokerage',
    name: 'Brokerage & Acquisition',
    shortName: 'Brokerage',
    tagline: 'Off-market vessels, selectively presented.',
    intro: 'Off-market yachts, sea trials in our own time, surveys we trust, and a purchase process measured in months, not weeks.',
    description:
      'The brokerage practice handles acquisition and sale of significant motor and sailing yachts for a small number of principals. We do not chase listings. We do not push transactions. We carry a private dossier of vessels quietly available, vessels presented off-market by their captains, and vessels whose owners would consider a serious offer. Sea trials happen in our time. Surveys are conducted by people we have known for two decades. A purchase process is measured in months rather than weeks, and the office sits at the table through closing.',
    highlights: [
      'Off-market dossier maintained for retained principals',
      'No commission stacking, no referral fees',
      'Pre-survey condition review by independent classed surveyors',
      'Sea-trial protocol owned by the office, not the listing broker',
      'Closing handled with marine counsel in the principal\'s jurisdiction',
    ],
    faqs: [
      {
        q: 'Do you list yachts publicly for sale?',
        a: 'Rarely. Most vessels in our dossier are presented under confidence agreements. A public listing appears only when the owner specifically requests it, and even then we maintain a private register of qualified buyers in parallel.',
      },
      {
        q: 'How are brokerage fees structured?',
        a: 'A buy-side retainer is charged at the outset of a search, deducted from the commission at closing. Sell-side mandates are commission-based at competitive rates. We do not accept simultaneous commissions from both sides on the same transaction.',
      },
      {
        q: 'Can you arrange surveys and sea trials internationally?',
        a: 'Yes. The office maintains a working list of surveyors across the Mediterranean, the Caribbean, the Pacific, and the major refit yards. Sea trials are scheduled at our pace, not the seller\'s.',
      },
    ],
  },
  {
    slug: 'refit',
    name: 'Refit & Project Oversight',
    shortName: 'Refit',
    tagline: 'Owner\'s representative, shipyard-side.',
    intro: 'From cosmetic refinishment to engineering re-power, the office sits shipyard-side until the launch is right and the paperwork is closed.',
    description:
      'Refit and project oversight covers every scale of yard work: cosmetic refinishment, mechanical re-power, navigation electronics upgrade, paint and gelcoat, interior remodel, lengthening, classification renewal, and warranty work. The office signs nothing without standing the work. We hold daily yard meetings, audit invoices line by line, photograph progress, and remain at the yard through launch trials. The principal sees a single written brief each week and a single invoice each month.',
    highlights: [
      'Owner\'s representative resident at the yard for the duration',
      'Daily yard meetings, weekly written brief to the principal',
      'Invoice audit and variation control against the agreed scope',
      'Yard relationships across the Mediterranean, the Caribbean, and the Pacific Northwest',
      'Punch-list closed before the principal sees the boat',
    ],
    faqs: [
      {
        q: 'Will you manage a refit at a yard we have chosen?',
        a: 'Yes. The office begins with a scoping visit to the yard, a contract review with marine counsel, and a kick-off meeting with the yard manager. From the first hammer-strike we are resident on site.',
      },
      {
        q: 'How do you control cost overruns at the yard?',
        a: 'Through a written change-order discipline. Any deviation from agreed scope requires a written variation, priced and signed before work continues. We audit invoices weekly and reconcile against the variation log monthly.',
      },
      {
        q: 'Do you manage interior design and styling as part of a refit?',
        a: 'We coordinate the studio of your choice and act as the operational interface with the yard. Many of our principals already have an interior designer; we work with them. When they do not, we make introductions.',
      },
    ],
  },
  {
    slug: 'crew',
    name: 'Crew Placement',
    shortName: 'Crew',
    tagline: 'People we have known for two decades.',
    intro: 'Captains, engineers, chefs, stewards, deckhands. People we have known for two decades, or vetted before we put them forward.',
    description:
      'Crew placement is conducted by a director who has stood watch herself. Candidates are presented only after a face-to-face interview, a written reference review, and a background check appropriate to the role. We do not run a database. We do not maintain a website of profiles. The office knows the people it puts forward. Where the principal already has a captain, we work with that captain on hires below the senior level. Where the principal is between captains, the office runs a discreet search.',
    highlights: [
      'Candidates known to the office, not to a database',
      'Reference reading conducted by the director, not by an assistant',
      'STCW, ENG1, and certification verified at source',
      'Probationary structure built into every offer letter',
      'Replacement guarantee on senior placements within the first ninety days',
    ],
    faqs: [
      {
        q: 'How is crew placement billed?',
        a: 'A retained search fee for senior placements (captain, chief engineer, head chef), or a placement fee at a percentage of annual salary for other roles. The fee is invoiced at offer acceptance, not at search commencement.',
      },
      {
        q: 'Do you handle ongoing crew administration?',
        a: 'When the principal also retains us for yacht management, yes: contracts, payroll, MLC compliance, training scheduling, and rotation logistics. Standalone crew placement is just that.',
      },
      {
        q: 'What is your replacement policy?',
        a: 'For senior placements, if the candidate leaves or is dismissed for performance within ninety days we run a replacement search at no additional fee. Below senior level, the replacement guarantee is sixty days.',
      },
    ],
  },
  {
    slug: 'detailing',
    name: 'Detailing & Daily Stewardship',
    shortName: 'Detailing',
    tagline: 'The hand work that decides whether a vessel ages with grace.',
    intro: 'Varnish, paint, leather, teak, polish, deep wash and rinse. The hand work that decides whether a vessel ages with grace or with age.',
    description:
      'Detailing and daily stewardship is the cumulative discipline of small, correctly handled tasks: morning wash and chamois, weekly compound and wax cycles, varnish maintenance on a schedule, teak deck care, stainless polishing, leather conditioning, upholstery rotation, brightwork attention before the principal arrives. The office contracts the detailing crews directly, supervises the work, photographs the result, and audits time-on-yacht. The vessel is left ready for guests, not ready for inspection.',
    highlights: [
      'Detailing crews known to the office, contracted directly',
      'Photographic record of work before, during, and after',
      'Quarterly cosmetic audit against the agreed standard',
      'Materials sourced from named suppliers, not generic chandlery',
      'Schedule planned around guest visits, not around crew convenience',
    ],
    faqs: [
      {
        q: 'Is detailing offered as a standalone service?',
        a: 'Yes. The office can manage detailing on a vessel where it does not otherwise have a retainer, on a port-by-port basis or on standing schedule.',
      },
      {
        q: 'How do you handle paint and varnish at the yard?',
        a: 'Through our refit practice. Detailing is the daily layer; yard work is the structural layer. The two practices share a director.',
      },
      {
        q: 'Can you cover a vessel during a transatlantic move?',
        a: 'Yes. Our detailing contracts extend across the Mediterranean, the Caribbean, and the Pacific Northwest, and we coordinate with itinerant crews where needed.',
      },
    ],
  },
  {
    slug: 'charter',
    name: 'Charter Programmes',
    shortName: 'Charter',
    tagline: 'Itineraries shaped to the principal.',
    intro: 'Itineraries shaped to the principal. Hospitality directed by people who have set the table themselves. Guests welcomed by name, never by spreadsheet.',
    description:
      'The charter practice runs both directions. For owners, the office structures and operates a charter programme: marketing, central agency placements, charter contracts, MYBA documentation, APA management, guest preparation, post-charter reconciliation, and tax structuring where relevant. For charterers, the office runs a bespoke private placement: a discreet shortlist, a thorough vetting of the boat, the captain, and the run-sheet, and a director on the ground at embarkation and disembarkation.',
    highlights: [
      'MYBA central agency relationships across all major regions',
      'APA managed with line-item visibility for the principal',
      'Charter contracts reviewed by marine counsel in the relevant jurisdiction',
      'Pre-arrival run-sheet prepared with the captain forty-eight hours in advance',
      'Post-charter brief delivered within five working days',
    ],
    faqs: [
      {
        q: 'Do you market our yacht for charter?',
        a: 'Through central agency placements that we vet, with the brochure, photography, and run-sheet that the office controls. We do not put a yacht on an open MLS without the principal\'s direct sign-off.',
      },
      {
        q: 'How is APA managed?',
        a: 'Through a dedicated charter account, with daily expense capture on the boat, weekly reconciliation by the office, and a written close-out within five working days of disembarkation.',
      },
      {
        q: 'Can you arrange a private charter for our family?',
        a: 'Yes. The office runs a discreet placement process across our trusted yacht network, presents a shortlist with full reasoning, and handles every detail from itinerary to guest dietary briefs.',
      },
    ],
  },
  {
    slug: 'engineering',
    name: 'Engineering & Technical Counsel',
    shortName: 'Engineering',
    tagline: 'Re-power studies, propulsion modelling, electronics.',
    intro: 'Re-power studies, propulsion modelling, navigation electronics, and classification advisory. We translate the yard\'s language to the office.',
    description:
      'Engineering and technical counsel is the office\'s in-house technical brain. We commission and review re-power studies, propulsion modelling, hull modification analyses, navigation and communications electronics architectures, and classification submissions. Where the principal needs a second opinion on a yard\'s recommendation, this practice writes it. Where a project requires a third-party engineering report for an insurance underwriter, this practice provides it. We do not sell equipment. We do not earn commissions on parts.',
    highlights: [
      'In-house technical review of yard proposals and engineering reports',
      'Second-opinion reports for insurance and classification submissions',
      'Propulsion, hull, and electronics architecture review at retainer level',
      'No commissions on parts, equipment, or specified vendors',
      'Technical lead resident at major refits',
    ],
    faqs: [
      {
        q: 'Is engineering counsel standalone or part of a retainer?',
        a: 'Both. For retained principals it is included. For standalone engagements (a single report, a single review) we work on a fixed-fee basis with a defined scope and deliverable.',
      },
      {
        q: 'Do you specify equipment or recommend brands?',
        a: 'We assess on merit. The office maintains no preferred-vendor arrangements and accepts no commissions from manufacturers or distributors. A recommendation is a recommendation.',
      },
      {
        q: 'Can you support an insurance claim with technical reporting?',
        a: 'Yes. We prepare independent technical reports for underwriters when a claim is contested or a survey is disputed. The reports stand on their own and are signed by a named engineer.',
      },
    ],
  },
  {
    slug: 'concierge',
    name: 'Berths, Transits & Concierge',
    shortName: 'Concierge',
    tagline: 'A telephone number that does not change.',
    intro: 'Moorings reserved, customs handled, transits planned, provisions waiting at the passerelle. A telephone number that does not change.',
    description:
      'The concierge practice handles the on-shore logistics that no captain should have to chase in a foreign harbour. Mooring reservations across the priority marinas. Customs and immigration handling for the yacht and her guests. Transit planning, fuel coordination, provisioning to the standing list, ground transport, security details, helicopter transfers, and the standing arrangements that make every harbour the home harbour.',
    highlights: [
      'Standing relationships at the priority marinas in every region',
      'Customs and immigration coordinated in advance, not at the dock',
      'Provisioning to the principal\'s standing list, refreshed seasonally',
      'Ground transport, security, and helicopter coordination on call',
      'Twenty-four-hour line for in-transit emergencies',
    ],
    faqs: [
      {
        q: 'How are concierge services billed?',
        a: 'Included in the management retainer for retained principals. On a per-event fee for standalone use, with all third-party costs passed through at cost.',
      },
      {
        q: 'Can you reserve berths at marinas we have never visited?',
        a: 'In most cases, yes. The office holds standing arrangements with the priority marinas in the Mediterranean, the Caribbean, and the Pacific Northwest, and reciprocal relationships in many secondary harbours.',
      },
      {
        q: 'What does the twenty-four-hour line cover?',
        a: 'In-transit logistics that cannot wait: a missed customs clearance, a guest medical incident, a weather diversion. Not a substitute for the captain\'s judgment, an addition to it.',
      },
    ],
  },
];

export const LOCATIONS: LocationDef[] = [
  {
    slug: 'monaco',
    name: 'Monaco',
    region: 'the Côte d\'Azur',
    country: 'Monaco',
    description:
      'Port Hercule is the working principal\'s home harbour. The Société d\'Exploitation des Ports de Monaco runs a tight quay; the office knows the quay-master by name. Bunkering, tenderage, helicopter transfer, and customs all happen here at the standard the principality demands.',
    harbours: ['Port Hercule', 'Cap d\'Ail', 'Fontvieille'],
    flavor: 'the working principal\'s home harbour and the natural pivot for the Western Mediterranean season',
    geo: { lat: 43.7333, lng: 7.4167 },
  },
  {
    slug: 'antibes',
    name: 'Antibes',
    region: 'the Côte d\'Azur',
    country: 'France',
    description:
      'Antibes is the operational capital of the Mediterranean yachting industry. Port Vauban, the IYCA refit precinct, the crew agencies, the surveyors, the chandlers: everything is within twenty minutes of the office. Most of our refit practice runs through Antibes and La Ciotat.',
    harbours: ['Port Vauban', 'Port Camille Rayon (Golfe-Juan)', 'Port Gallice'],
    flavor: 'the operational capital of Mediterranean yachting and the natural address for refit and crew matters',
    geo: { lat: 43.5808, lng: 7.1239 },
  },
  {
    slug: 'newport',
    name: 'Newport',
    region: 'New England',
    country: 'United States',
    description:
      'Newport is the office\'s New England base. The Newport Shipyard, the IYRS, the Edgewater and Bannister\'s docks, the Yachting Capital itself: the office runs the summer programme out of Newport and the autumn shoulder season into the Chesapeake from the same address.',
    harbours: ['Newport Shipyard', 'Bannister\'s Wharf', 'Goat Island'],
    flavor: 'the office\'s New England address and the natural pivot for the Eastern Seaboard season',
    geo: { lat: 41.4901, lng: -71.3128 },
  },
  {
    slug: 'seattle',
    name: 'Seattle',
    region: 'the Pacific Northwest',
    country: 'United States',
    description:
      'Seattle is the office\'s Pacific Northwest base. The Lake Union refit yards, Shilshole Bay, and the standing arrangements for transits into British Columbia and Alaska are managed from here. The Pacific cruise season runs through this office.',
    harbours: ['Shilshole Bay Marina', 'Lake Union refit yards', 'Bell Harbor'],
    flavor: 'the office\'s Pacific Northwest base and the natural pivot for the Alaskan summer season',
    geo: { lat: 47.6062, lng: -122.3321 },
  },
];

export function findService(slug: string): ServiceDef | null {
  return SERVICES.find(s => s.slug === slug) || null;
}
export function findLocation(slug: string): LocationDef | null {
  return LOCATIONS.find(l => l.slug === slug) || null;
}
