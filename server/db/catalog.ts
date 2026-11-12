import type { pets } from './schema.ts'

const catalog = {
  dog: ['Maple', 'Scout', 'Juniper', 'Otis', 'Honey', 'Roo', 'Clover', 'Bowie', 'Milo', 'Pepper', 'Mabel', 'Hugo', 'Nellie', 'Teddy', 'Remy', 'Poppy', 'Gus', 'Winnie', 'Biscuit', 'Fern', 'Moose', 'Tula', 'Frankie', 'Sunny', 'Tucker', 'Olive', 'Nori', 'Pip', 'Mochi', 'Blue', 'Suki', 'Dottie', 'Rosie', 'Toby', 'Pearl', 'Bean', 'Hazel', 'Wally', 'Luna'],
  cat: ['Fig', 'Jasper', 'Miso', 'Plum', 'Cricket', 'Cleo', 'Smudge', 'Cedar', 'Opal', 'Pickle', 'Pesto', 'Ivy', 'Toast', 'Ziggy'],
  bird: ['Kiwi', 'Peaches', 'Rio', 'Skye', 'Pico', 'Coco', 'Saffron', 'Basil', 'Chirp'],
  rabbit: ['Oat', 'Thistle', 'Dandelion'],
  reptile: ['Pebble', 'Sage'],
}

type Species = keyof typeof catalog

const bios: Record<Species, string[]> = {
  dog: ['Loves sniffing out new trails and settling in for a nap afterward.', 'A cheerful walking buddy who is learning to sit for treats.', 'Happiest with a squeaky toy and a spot near you on the sofa.', 'Enjoys slow mornings and meeting people at a comfortable pace.'],
  cat: ['Likes sunny windowsills and an evening game with a wand toy.', 'Takes a little time to warm up and then happily keeps you company.', 'An enthusiastic box inspector who loves a good perch.'],
  bird: ['Curious about new perches and happiest with a steady daily routine.', 'Enjoys foraging toys and a quiet place to settle in the evening.'],
  rabbit: ['Loves tunnels, leafy greens, and a roomy place to explore.', 'A gentle rabbit who warms up when you sit quietly nearby.', 'Happiest with a hay pile and cardboard to investigate.'],
  reptile: ['Enjoys a warm basking spot and a peaceful enclosure.', 'Curious at feeding time and comfortable in a predictable habitat.'],
}

const locations = ['Toronto, ON', 'Mississauga, ON', 'Oakville, ON', 'Brampton, ON', 'Hamilton, ON']

export const mockPets: (typeof pets.$inferInsert)[] = (Object.keys(catalog) as Species[])
  .flatMap(species => catalog[species].map((name, index) => ({
    id: `${species}-${index + 1}`,
    species,
    name,
    ageMonths: 8 + ((index * 17) % 96),
    location: locations[index % locations.length],
    bio: bios[species][index % bios[species].length],
    imageUrl: `https://pets-images.dev-apis.com/pets/${species}${index + 1}.jpg`,
  })))
