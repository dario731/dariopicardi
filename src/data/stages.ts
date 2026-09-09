/**
 * Stage definitions for the cinematic StageScroller on Home, Story and
 * Global Career. Copy comes from src/i18n/en.ts; cameras, routes and lit
 * places are defined here (place ids from src/content/data/places.json).
 * Zoom 1 = the whole world width; 6 ≈ one country.
 */
import type { Stage } from '@components/cinematic/StageScroller.astro';
import { getCopy, type Locale } from '@i18n/index';
import sea from '@assets/images/dario-sea-miami.jpg';
import skyline from '@assets/images/dario-miami-skyline.jpg';
import portrait from '@assets/images/portrait-dario-bw-tmp.jpg';

const IMG = {
  sea: { src: sea, alt: 'Dario Picardi at sea off Miami', note: 'At sea · Miami' },
  skyline: { src: skyline, alt: 'Dario Picardi on the water off Miami, the skyline behind him', note: 'Miami · building from here' },
  portrait: { src: portrait, alt: 'Dario Picardi', note: 'Portrait FOUNDER-01 (placeholder)' },
};

export function homeStages(locale: Locale = 'en'): Stage[] {
  const s = getCopy(locale).home.journey.stages;
  const geo: Record<string, Partial<Stage>> = {
    roots: { camera: { place: 'calabria', zoom: 6 }, places: ['calabria'], placeholder: 'Calabria — archival photograph (approval required)' },
    instinct: { camera: { place: 'calabria', zoom: 4.6 }, places: ['calabria'] },
    discipline: { camera: { lat: 41.5, lng: 8, zoom: 3.6 }, places: ['calabria', 'valencia'], route: [['calabria', 'valencia']] },
    executive: { camera: { lat: 28, lng: -18, zoom: 1.25 }, places: ['milan', 'london', 'new-york', 'sao-paulo', 'mexico', 'dubai', 'singapore'], route: [['milan', 'london'], ['milan', 'new-york'], ['new-york', 'sao-paulo'], ['new-york', 'mexico'], ['milan', 'dubai'], ['dubai', 'singapore']] },
    entrepreneur: { camera: { place: 'miami', zoom: 3 }, places: ['miami'], route: [['new-york', 'miami']], image: IMG.skyline },
    person: { camera: { place: 'miami', zoom: 5.5 }, places: ['miami'], image: IMG.sea },
  };
  return s.map((st) => ({ ...st, ...(geo[st.id] as Stage) }));
}

export function storyStages(locale: Locale = 'en'): Stage[] {
  const s = getCopy(locale).story.stages;
  const geo: Record<string, Partial<Stage>> = {
    roots: { camera: { place: 'calabria', zoom: 6.5 }, places: ['calabria'], placeholder: 'Calabria — archival photograph (approval required)' },
    instinct: { camera: { place: 'calabria', zoom: 5 }, places: ['calabria'], image: IMG.portrait },
    discipline: { camera: { lat: 41.5, lng: 8, zoom: 3.6 }, places: ['calabria', 'valencia'], route: [['calabria', 'valencia']], placeholder: 'University years — Università della Calabria (approval required)' },
    world: { camera: { lat: 26, lng: -10, zoom: 1.2 }, places: ['milan', 'london', 'new-york', 'sao-paulo', 'mexico', 'dubai', 'singapore', 'mumbai'], route: [['milan', 'london'], ['milan', 'new-york'], ['new-york', 'sao-paulo'], ['new-york', 'mexico'], ['milan', 'dubai'], ['dubai', 'mumbai'], ['dubai', 'singapore']] },
    'executive-to-entrepreneur': { camera: { place: 'miami', zoom: 3.2 }, places: ['miami'], route: [['milan', 'miami']], image: IMG.skyline },
    investor: { camera: { lat: 8, lng: -70, zoom: 1.9 }, places: ['miami', 'mexico', 'sao-paulo'], route: [['miami', 'mexico'], ['miami', 'sao-paulo']], placeholder: 'BIZ & STYLE operations — office, warehouse, team (approval required)' },
    connector: { camera: { lat: 34, lng: -32, zoom: 1.7 }, places: ['calabria', 'miami'], route: [['miami', 'calabria']], placeholder: 'Friends and long-term relationships (approval required)' },
    life: { camera: { place: 'miami', zoom: 6 }, places: ['miami'], image: IMG.sea },
    family: { camera: { place: 'miami', zoom: 7.5 }, places: ['miami'], placeholder: 'Family photograph — approved by Dario and Alfonsina' },
  };
  return s.map((st) => ({ ...st, ...(geo[st.id] as Stage) }));
}

export function careerStages(locale: Locale = 'en'): Stage[] {
  const s = getCopy(locale).career.stages;
  const geo: Record<string, Partial<Stage>> = {
    foundations: { camera: { lat: 42.5, lng: 11, zoom: 4.2 }, places: ['calabria', 'valencia', 'milan'], route: [['calabria', 'valencia'], ['calabria', 'milan']] },
    'americas-europe': { camera: { lat: 22, lng: -35, zoom: 1.5 }, places: ['milan', 'new-york', 'sao-paulo', 'mexico', 'miami'], route: [['milan', 'new-york'], ['new-york', 'sao-paulo'], ['new-york', 'mexico'], ['new-york', 'miami']] },
    'international-division': { camera: { lat: 24, lng: 10, zoom: 1.1 }, places: ['new-york', 'london', 'milan', 'dubai', 'mumbai', 'caribbean', 'montevideo', 'mexico', 'cannes'], route: [['new-york', 'london'], ['london', 'milan'], ['milan', 'dubai'], ['dubai', 'mumbai'], ['new-york', 'caribbean'], ['caribbean', 'montevideo'], ['milan', 'cannes']] },
    miami: { camera: { place: 'miami', zoom: 3.4 }, places: ['miami'], route: [['new-york', 'miami']], image: IMG.skyline },
    builder: { camera: { lat: 6, lng: -68, zoom: 1.9 }, places: ['miami', 'mexico', 'sao-paulo'], route: [['miami', 'mexico'], ['miami', 'sao-paulo']], placeholder: 'BIZ & STYLE — team, warehouse, partners (approval required)' },
  };
  return s.map((st) => ({ ...st, ...(geo[st.id] as Stage) }));
}
