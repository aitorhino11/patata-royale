import {
  BattlePassTier,
  BombAccessory,
  BombSkin,
  DailyMission,
  ExplosionEffect,
  GameSettings,
  LeaderboardEntry,
  TrailEffect,
  UserAccount,
  UserProfile,
} from '../types/game';

// 22+ Unique, Highly Detailed Bomb Skins
export const BOMB_SKINS: BombSkin[] = [
  {
    id: 'skin_default',
    name: 'Bomba Clásica Azul',
    description: 'El azul cobalto del héroe original con brillo de zafiro pulido.',
    price: 0,
    unlocked: true,
    rarity: 'comun',
    bodyGrad: ['#38bdf8', '#0284c7', '#0369a1', '#082f49'],
    accent: '#facc15',
    glow: 'rgba(56, 189, 248, 0.5)',
  },
  {
    id: 'skin_gold',
    name: 'Oro Macizo 24K',
    description: 'Fundida en oro ceremonial puro con destellos que ciegan a los rivales.',
    price: 1200,
    unlocked: false,
    rarity: 'legendario',
    bodyGrad: ['#fef08a', '#facc15', '#ca8a04', '#713f12'],
    accent: '#ffffff',
    glow: 'rgba(250, 204, 21, 0.8)',
  },
  {
    id: 'skin_cyberpunk',
    name: 'Ciber-Neón 2099',
    description: 'Blindaje de fibra de carbono con circuitos de plasma ultravioleta.',
    price: 850,
    unlocked: false,
    rarity: 'epico',
    bodyGrad: ['#f472b6', '#db2777', '#9d174d', '#500724'],
    accent: '#22d3ee',
    glow: 'rgba(236, 72, 153, 0.7)',
    battlePassLevel: 25,
  },
  {
    id: 'skin_magma',
    name: 'Magma Volcánico',
    description: 'Corteza basáltica ardiendo con magma a más de 1200 grados.',
    price: 900,
    unlocked: false,
    rarity: 'epico',
    bodyGrad: ['#f97316', '#ea580c', '#c2410c', '#431407'],
    accent: '#fef08a',
    glow: 'rgba(234, 88, 12, 0.8)',
    battlePassLevel: 50,
  },
  {
    id: 'skin_toxic',
    name: 'Limo Radiactivo',
    description: 'Desechos atómicos concentrados que brillan en la más densa oscuridad.',
    price: 650,
    unlocked: false,
    rarity: 'raro',
    bodyGrad: ['#bef264', '#84cc16', '#4d7c0f', '#1a2e05'],
    accent: '#facc15',
    glow: 'rgba(132, 204, 22, 0.8)',
  },
  {
    id: 'skin_void',
    name: 'Agujero Cósmico',
    description: 'Materia oscura que absorbe los fotones del universo.',
    price: 1500,
    unlocked: false,
    rarity: 'legendario',
    bodyGrad: ['#c084fc', '#9333ea', '#6b21a8', '#2e1065'],
    accent: '#38bdf8',
    glow: 'rgba(147, 51, 234, 0.9)',
  },
  {
    id: 'skin_ice',
    name: 'Glaciar Eterno',
    description: 'Hielo permafrost milenario tallado en una esfera helada.',
    price: 600,
    unlocked: false,
    rarity: 'raro',
    bodyGrad: ['#e0f2fe', '#7dd3fc', '#0284c7', '#082f49'],
    accent: '#ffffff',
    glow: 'rgba(125, 211, 252, 0.6)',
  },
  {
    id: 'skin_crimson',
    name: 'Furia Carmesí',
    description: 'Rojo sangre de gladiador con acabados metálicos de batalla.',
    price: 550,
    unlocked: false,
    rarity: 'raro',
    bodyGrad: ['#f87171', '#dc2626', '#991b1b', '#450a0a'],
    accent: '#facc15',
    glow: 'rgba(220, 38, 38, 0.7)',
  },
  {
    id: 'skin_kawaii',
    name: 'Algodón Pastel',
    description: 'Dulzura pura con un toque de canela y dinamita.',
    price: 450,
    unlocked: false,
    rarity: 'comun',
    bodyGrad: ['#fbcfe8', '#f472b6', '#db2777', '#831843'],
    accent: '#fef08a',
    glow: 'rgba(244, 114, 182, 0.6)',
  },
  {
    id: 'skin_ghost',
    name: 'Espectro Fantasmal',
    description: 'Traslúcida y etérea, susurra los nombres de quienes explotaron.',
    price: 750,
    unlocked: false,
    rarity: 'raro',
    bodyGrad: ['#f1f5f9', '#cbd5e1', '#64748b', '#1e293b'],
    accent: '#38bdf8',
    glow: 'rgba(203, 213, 225, 0.7)',
  },
  {
    id: 'skin_diamond',
    name: 'Diamante Puro',
    description: 'El material más duro del planeta, tallado en facetas prismáticas.',
    price: 2000,
    unlocked: false,
    rarity: 'legendario',
    bodyGrad: ['#ffffff', '#a5f3fc', '#06b6d4', '#164e63'],
    accent: '#ffffff',
    glow: 'rgba(6, 182, 212, 0.9)',
    battlePassLevel: 75,
  },
  {
    id: 'skin_emerald',
    name: 'Esmeralda Mística',
    description: 'Gema pulida en los templos ancestrales de la jungla.',
    price: 700,
    unlocked: false,
    rarity: 'raro',
    bodyGrad: ['#6ee7b7', '#10b981', '#047857', '#064e3b'],
    accent: '#fef08a',
    glow: 'rgba(16, 185, 129, 0.7)',
  },
  {
    id: 'skin_steampunk',
    name: 'Bronce Steampunk',
    description: 'Engranajes de latón, remaches oxidados y vapor a presión.',
    price: 650,
    unlocked: false,
    rarity: 'raro',
    bodyGrad: ['#fdba74', '#ea580c', '#9a3412', '#431407'],
    accent: '#fde047',
    glow: 'rgba(234, 88, 12, 0.5)',
  },
  {
    id: 'skin_galaxy',
    name: 'Vía Láctea Estelar',
    description: 'Contiene nebulosas enteras girando en su interior esférico.',
    price: 1100,
    unlocked: false,
    rarity: 'epico',
    bodyGrad: ['#e9d5ff', '#a855f7', '#6b21a8', '#3b0764'],
    accent: '#38bdf8',
    glow: 'rgba(168, 85, 247, 0.8)',
  },
  {
    id: 'skin_matrix',
    name: 'Código Binario',
    description: 'Cadenas de ceros y unos verdes fluyendo sobre esmalte negro.',
    price: 500,
    unlocked: false,
    rarity: 'comun',
    bodyGrad: ['#4ade80', '#22c55e', '#15803d', '#052e16'],
    accent: '#ffffff',
    glow: 'rgba(34, 197, 94, 0.7)',
  },
  {
    id: 'skin_carbon',
    name: 'Fibra de Carbono',
    description: 'Material aeroespacial ultraligero para aceleración de pase máxima.',
    price: 450,
    unlocked: false,
    rarity: 'comun',
    bodyGrad: ['#475569', '#334155', '#1e293b', '#0f172a'],
    accent: '#ef4444',
    glow: 'rgba(71, 85, 105, 0.4)',
  },
  {
    id: 'skin_amethyst',
    name: 'Amatista Real',
    description: 'Cristales violetas con vibraciones místicas que calman la mecha.',
    price: 800,
    unlocked: false,
    rarity: 'epico',
    bodyGrad: ['#d8b4fe', '#c084fc', '#9333ea', '#581c87'],
    accent: '#fbcfe8',
    glow: 'rgba(192, 132, 252, 0.7)',
  },
  {
    id: 'skin_rainbow',
    name: 'Cromática Arcoíris',
    description: 'Pintura iridiscente que cambia de color según el ángulo de la luz.',
    price: 950,
    unlocked: false,
    rarity: 'epico',
    bodyGrad: ['#f43f5e', '#ec4899', '#8b5cf6', '#06b6d4'],
    accent: '#fde047',
    glow: 'rgba(236, 72, 153, 0.8)',
  },
  {
    id: 'skin_phoenix',
    name: 'Fénix Inmortal',
    description: 'La piel sagrada del nivel 100 del Pase de Batalla. Renace de las cenizas.',
    price: 2500,
    unlocked: false,
    rarity: 'legendario',
    bodyGrad: ['#fef08a', '#fb923c', '#dc2626', '#7f1d1d'],
    accent: '#ffffff',
    glow: 'rgba(251, 146, 60, 0.95)',
    battlePassLevel: 100,
  },
  {
    id: 'skin_solar',
    name: 'Llamarada Solar',
    description: 'Plasma solar a millones de grados con manchas de energía pura.',
    price: 1300,
    unlocked: false,
    rarity: 'legendario',
    bodyGrad: ['#fef08a', '#f59e0b', '#d97706', '#78350f'],
    accent: '#ffffff',
    glow: 'rgba(245, 158, 11, 0.85)',
  },
  {
    id: 'skin_camo',
    name: 'Camuflaje Militar',
    description: 'Pintura táctica de selva para emboscadas de patata caliente.',
    price: 400,
    unlocked: false,
    rarity: 'comun',
    bodyGrad: ['#a3e635', '#65a30d', '#3f6212', '#14532d'],
    accent: '#78350f',
  },
  {
    id: 'skin_shadow',
    name: 'Sombra Ninja',
    description: 'Negro mate absoluto que no refleja ni la luz de la mecha.',
    price: 600,
    unlocked: false,
    rarity: 'raro',
    bodyGrad: ['#334155', '#1e293b', '#0f172a', '#020617'],
    accent: '#dc2626',
    glow: 'rgba(220, 38, 38, 0.5)',
  },
];

// 22+ Unique Bomb Accessories & Hats
export const BOMB_ACCESSORIES: BombAccessory[] = [
  { id: 'hat_crown', name: 'Corona Real de Oro', description: 'Para el rey indiscutible de la patata.', category: 'hat', price: 0, unlocked: true, rarity: 'comun', renderKey: 'crown', icon: '👑' },
  { id: 'hat_cowboy', name: 'Sombrero Vaquero', description: 'El más rápido desenfundando patatas.', category: 'hat', price: 300, unlocked: false, rarity: 'comun', renderKey: 'cowboy', icon: '🤠' },
  { id: 'hat_headphones', name: 'Auriculares Gaming RGB', description: 'Escucha el pip-pip en Dolby Surround.', category: 'hat', price: 500, unlocked: false, rarity: 'raro', renderKey: 'headphones', icon: '🎧' },
  { id: 'hat_mohawk', name: 'Cresta Punk Neón', description: 'Actitud rebelde y anarquía explosiva.', category: 'hat', price: 450, unlocked: false, rarity: 'comun', renderKey: 'mohawk', icon: '🎸' },
  { id: 'hat_pirate', name: 'Parche y Pañuelo Pirata', description: '¡Al abordaje con la patata!', category: 'face', price: 400, unlocked: false, rarity: 'comun', renderKey: 'pirate', icon: '🏴‍☠️' },
  { id: 'hat_cap', name: 'Gorra Skater hacia Atrás', description: 'Estilo callejero desenfadado.', category: 'hat', price: 250, unlocked: false, rarity: 'comun', renderKey: 'cap', icon: '🧢' },
  { id: 'hat_sunglasses', name: 'Gafas de Espía 007', description: 'Mira las explosiones sin parpadear.', category: 'face', price: 350, unlocked: false, rarity: 'comun', renderKey: 'sunglasses', icon: '🕶️' },
  { id: 'hat_ribbon', name: 'Lazo Pastel Kawaii', description: 'Dulzura que oculta un peligro mortal.', category: 'hat', price: 300, unlocked: false, rarity: 'comun', renderKey: 'ribbon', icon: '🎀' },
  { id: 'hat_viking', name: 'Casco Vikingo con Cuernos', description: '¡Por Odín y por las patatas del Valhalla!', category: 'hat', price: 600, unlocked: false, rarity: 'raro', renderKey: 'viking', icon: '🛡️' },
  { id: 'hat_beret', name: 'Boina y Bigotito Bohemio', description: 'C\'est magnifique, mon ami.', category: 'hat', price: 350, unlocked: false, rarity: 'comun', renderKey: 'beret', icon: '🥖' },
  { id: 'hat_wizard', name: 'Sombrero de Archimago', description: 'Canaliza hechizos pirotécnicos arcanos.', category: 'hat', price: 800, unlocked: false, rarity: 'epico', renderKey: 'wizard', icon: '🧙' },
  { id: 'hat_tophat', name: 'Chistera Steampunk con Lentes', description: 'Elegancia victoriana con alta ingeniería.', category: 'hat', price: 750, unlocked: false, rarity: 'epico', renderKey: 'tophat', icon: '🎩' },
  { id: 'hat_halo', name: 'Aureola Celestial Bendita', description: 'Brilla con pureza divina sobre tu mecha.', category: 'hat', price: 900, unlocked: false, rarity: 'legendario', renderKey: 'halo', icon: '😇' },
  { id: 'hat_horns', name: 'Cuernos de Demonio Ígneo', description: 'Forjados en las calderas del inframundo.', category: 'hat', price: 850, unlocked: false, rarity: 'epico', renderKey: 'horns', icon: '😈' },
  { id: 'hat_astronaut', name: 'Casco de Astronauta NASA', description: 'Protección para explosiones en gravedad cero.', category: 'hat', price: 950, unlocked: false, rarity: 'legendario', renderKey: 'astronaut', icon: '👨‍🚀' },
  { id: 'hat_superhero', name: 'Antifaz del Justiciero', description: 'Oculta tu identidad secreta de las bombas.', category: 'face', price: 400, unlocked: false, rarity: 'raro', renderKey: 'superhero', icon: '🦸' },
  { id: 'hat_detective', name: 'Sombrero Sherlock Holmes', description: 'Elemental, mi querida patata.', category: 'hat', price: 500, unlocked: false, rarity: 'raro', renderKey: 'detective', icon: '🕵️' },
  { id: 'hat_flower', name: 'Corona de Flores Silvestres', description: 'Paz, amor y mechas encendidas.', category: 'hat', price: 350, unlocked: false, rarity: 'comun', renderKey: 'flower', icon: '🌸' },
  { id: 'hat_samurai', name: 'Casco Kabuto Samurai', description: 'Honor inquebrantable hasta el estallido.', category: 'hat', price: 1100, unlocked: false, rarity: 'legendario', renderKey: 'samurai', icon: '⚔️' },
  { id: 'hat_visor', name: 'Visor Cibernético Táctico', description: 'Calcula trayectorias balísticas en HUD holográfico.', category: 'face', price: 850, unlocked: false, rarity: 'epico', renderKey: 'visor', icon: '🤖' },
  { id: 'hat_chef', name: 'Gorro de Gran Chef', description: 'Especialista en patatas bien asadas.', category: 'hat', price: 450, unlocked: false, rarity: 'comun', renderKey: 'chef', icon: '👨‍🍳' },
  { id: 'hat_party', name: 'Gorro de Fiesta de Cumpleaños', description: '¡Que comience la fiesta explosiva!', category: 'hat', price: 200, unlocked: false, rarity: 'comun', renderKey: 'party', icon: '🥳' },
];

// 22+ Unique Throw Trails
export const TRAIL_EFFECTS: TrailEffect[] = [
  { id: 'trail_fire', name: 'Llamarada Ígnea', description: 'Estela clásica de fuego y brasas vivas.', price: 0, unlocked: true, rarity: 'comun', previewColor: '#f97316', icon: '🔥' },
  { id: 'trail_lightning', name: 'Rayo Voltaico', description: 'Chispas eléctricas de 50.000 voltios.', price: 450, unlocked: false, rarity: 'epico', previewColor: '#38bdf8', icon: '⚡' },
  { id: 'trail_rainbow', name: 'Estela Cromática Arcoíris', description: 'Gradiente hipnótico a la velocidad de la luz.', price: 650, unlocked: false, rarity: 'legendario', previewColor: '#ec4899', icon: '🌈' },
  { id: 'trail_smoke', name: 'Humo Carmesí Militar', description: 'Rastro denso de pólvora de combate.', price: 200, unlocked: false, rarity: 'comun', previewColor: '#dc2626', icon: '💨' },
  { id: 'trail_bubbles', name: 'Burbujas Acuáticas', description: 'Pompas de jabón que estallan en el vuelo.', price: 300, unlocked: false, rarity: 'comun', previewColor: '#06b6d4', icon: '🫧' },
  { id: 'trail_stars', name: 'Polvo de Estrellas Fugaces', description: 'Constelaciones brillantes que cruzan la mesa.', price: 600, unlocked: false, rarity: 'epico', previewColor: '#facc15', icon: '⭐' },
  { id: 'trail_hearts', name: 'Amor Ardiente', description: 'Corazones palpitantes llenos de pasión.', price: 400, unlocked: false, rarity: 'raro', previewColor: '#f43f5e', icon: '💖' },
  { id: 'trail_glitch', name: 'Glitch Digital Matrix', description: 'Píxeles y artefactos visuales corruptos.', price: 550, unlocked: false, rarity: 'raro', previewColor: '#22c55e', icon: '👾' },
  { id: 'trail_ice', name: 'Escarcha Helada', description: 'Cristales de nieve que congelan el aire.', price: 450, unlocked: false, rarity: 'raro', previewColor: '#a5f3fc', icon: '❄️' },
  { id: 'trail_laser', name: 'Haz Láser de Fusión', description: 'Línea de fotones coherentes de alta energía.', price: 700, unlocked: false, rarity: 'epico', previewColor: '#ef4444', icon: '🔴' },
  { id: 'trail_skulls', name: 'Almas en Pena', description: 'Calaveras espectrales que gritan al volar.', price: 800, unlocked: false, rarity: 'legendario', previewColor: '#94a3b8', icon: '💀' },
  { id: 'trail_leaves', name: 'Vórtice de Hojas de Otoño', description: 'Hojas secas mecidas por el viento.', price: 250, unlocked: false, rarity: 'comun', previewColor: '#d97706', icon: '🍂' },
  { id: 'trail_coins', name: 'Lluvia de Monedas de Oro', description: 'Monedas centelleantes que caen al pasar.', price: 950, unlocked: false, rarity: 'legendario', previewColor: '#eab308', icon: '🪙' },
  { id: 'trail_sakura', name: 'Pétalos de Flor de Cerezo', description: 'Primavera zen japonesa en pleno caos.', price: 500, unlocked: false, rarity: 'raro', previewColor: '#fbcfe8', icon: '🌸' },
  { id: 'trail_magic', name: 'Polvo de Hadas Arcano', description: 'Brillantes motas púrpuras de brujería.', price: 650, unlocked: false, rarity: 'epico', previewColor: '#c084fc', icon: '✨' },
  { id: 'trail_neon', name: 'Chispas de Neón Tokio', description: 'Luces estroboscópicas de alta frecuencia.', price: 600, unlocked: false, rarity: 'raro', previewColor: '#10b981', icon: '💡' },
  { id: 'trail_meteor', name: 'Lluvia de Meteoros', description: 'Fragmentos incandescentes del espacio profundo.', price: 850, unlocked: false, rarity: 'legendario', previewColor: '#ea580c', icon: '☄️' },
  { id: 'trail_cosmic', name: 'Nebulosa Interestelar', description: 'Polvo interestelar con tonos magenta y cian.', price: 900, unlocked: false, rarity: 'legendario', previewColor: '#8b5cf6', icon: '🌌' },
  { id: 'trail_sonic', name: 'Ondas Sónicas Supersónicas', description: 'Anillos de choque de compresión acústica.', price: 550, unlocked: false, rarity: 'raro', previewColor: '#3b82f6', icon: '🔊' },
  { id: 'trail_slime', name: 'Salpicadura de Slime Ácido', description: 'Gotas de gelatina ácida corrosiva.', price: 350, unlocked: false, rarity: 'comun', previewColor: '#84cc16', icon: '🧪' },
  { id: 'trail_candy', name: 'Caramelos y Chupachups', description: 'Dulces saltarines de todos los sabores.', price: 300, unlocked: false, rarity: 'comun', previewColor: '#fb7185', icon: '🍭' },
  { id: 'trail_music', name: 'Notas Musicales Alegres', description: 'Melodías flotantes al ritmo del pip-pip.', price: 400, unlocked: false, rarity: 'raro', previewColor: '#e879f9', icon: '🎵' },
];

// 22+ Unique Explosions
export const EXPLOSION_EFFECTS: ExplosionEffect[] = [
  { id: 'exp_classic', name: 'Detonación de Pólvora', description: 'La explosión estándar de dinamita y humo.', price: 0, unlocked: true, rarity: 'comun', previewColor: '#ef4444', icon: '💥' },
  { id: 'exp_confetti', name: 'Fiesta de Confeti Festivo', description: '¡Sorpresa! Papelitos de colores en vez de fuego.', price: 350, unlocked: false, rarity: 'raro', previewColor: '#eab308', icon: '🎉' },
  { id: 'exp_plasma', name: 'Onda de Choque de Plasma', description: 'Pulso electromagnético azul desintegrador.', price: 650, unlocked: false, rarity: 'epico', previewColor: '#3b82f6', icon: '⚡' },
  { id: 'exp_nuclear', name: 'Mini Hongo Atómico', description: 'Resplandor cegador con humo en forma de hongo.', price: 1000, unlocked: false, rarity: 'legendario', previewColor: '#22c55e', icon: '☢️' },
  { id: 'exp_supernova', name: 'Supernova Estelar', description: 'Colapso gravitacional que expulsa rayos gamma.', price: 1200, unlocked: false, rarity: 'legendario', previewColor: '#a855f7', icon: '🌟' },
  { id: 'exp_fireworks', name: 'Fuegos Artificiales Triunfales', description: 'Palmeras de chispas rojas, verdes y doradas.', price: 700, unlocked: false, rarity: 'epico', previewColor: '#f43f5e', icon: '🎆' },
  { id: 'exp_toxic', name: 'Nube de Gas Ácido', description: 'Gas verde fluorescente altamente corrosivo.', price: 500, unlocked: false, rarity: 'raro', previewColor: '#84cc16', icon: '☣️' },
  { id: 'exp_birthday', name: 'Tarta Explosiva de Cumpleaños', description: 'Nata montada, fresas y velas volando.', price: 400, unlocked: false, rarity: 'comun', previewColor: '#f472b6', icon: '🎂' },
  { id: 'exp_slime', name: 'Explosión de Baba Verde', description: 'Pringue viscoso que salpica toda la mesa.', price: 300, unlocked: false, rarity: 'comun', previewColor: '#a3e635', icon: '🟢' },
  { id: 'exp_ice', name: 'Estallido de Hielo Glacial', description: 'Espinazos de hielo afilado que rompen la silla.', price: 600, unlocked: false, rarity: 'raro', previewColor: '#38bdf8', icon: '🧊' },
  { id: 'exp_blackhole', name: 'Implosión de Singularidad', description: 'Todo es absorbido hacia el centro del vacío.', price: 1500, unlocked: false, rarity: 'legendario', previewColor: '#312e81', icon: '🕳️' },
  { id: 'exp_coins', name: 'Piñata de Monedas', description: '¡Lluvia dorada de riqueza instantánea!', price: 850, unlocked: false, rarity: 'epico', previewColor: '#facc15', icon: '💰' },
  { id: 'exp_electric', name: 'Descarga de Tesla', description: 'Arcos eléctricos azules de un millón de voltios.', price: 750, unlocked: false, rarity: 'epico', previewColor: '#0ea5e9', icon: '🌩️' },
  { id: 'exp_volcano', name: 'Erupción Volcánica de Lava', description: 'Geiser de roca fundida y ceniza volcánica.', price: 900, unlocked: false, rarity: 'epico', previewColor: '#ea580c', icon: '🌋' },
  { id: 'exp_glitch', name: 'Colapso de Texturas Glitch', description: 'Error fatal de pantalla azul y píxeles rotos.', price: 550, unlocked: false, rarity: 'raro', previewColor: '#10b981', icon: '🖥️' },
  { id: 'exp_bats', name: 'Enjambre de Murciélagos', description: 'Murciélagos nocturnos saliendo en estampida.', price: 650, unlocked: false, rarity: 'raro', previewColor: '#475569', icon: '🦇' },
  { id: 'exp_roses', name: 'Tormenta de Pétalos Rojos', description: 'Elegancia dramática para una derrota con estilo.', price: 450, unlocked: false, rarity: 'comun', previewColor: '#e11d48', icon: '🌹' },
  { id: 'exp_crystal', name: 'Cristales Rotos Prismáticos', description: 'Mil esquirlas de vidrio brillante de colores.', price: 800, unlocked: false, rarity: 'epico', previewColor: '#06b6d4', icon: '💎' },
  { id: 'exp_meteor', name: 'Impacto de Asteroide', description: 'Cráter de humo y fuego cósmico.', price: 1100, unlocked: false, rarity: 'legendario', previewColor: '#c2410c', icon: '☄️' },
  { id: 'exp_bubbles', name: 'Estallido Gigante de Burbujas', description: 'Una gran pompa que hace ¡POP!', price: 250, unlocked: false, rarity: 'comun', previewColor: '#7dd3fc', icon: '🫧' },
  { id: 'exp_pixel', name: 'Explosión Retro 8-Bits', description: 'Vóxel art de los años 80 desmoronándose.', price: 400, unlocked: false, rarity: 'comun', previewColor: '#f59e0b', icon: '🕹️' },
  { id: 'exp_divine', name: 'Rayo Divino del Olimpo', description: 'Luz sagrada que purifica la silla con gloria.', price: 1400, unlocked: false, rarity: 'legendario', previewColor: '#fef08a', icon: '⚡' },
];

export const AVATAR_OPTIONS = [
  '🔥', '🥔', '💣', '👑', '⚡', '🌶️', '🚀', '💀', '🤖', '👾', '🐱', '🦊', '🤠', '🥷', '💥', '🏆'
];

export const TITLE_OPTIONS = [
  'El Esquivador',
  'Manos de Mantequilla',
  'Pirotécnico Supremo',
  'Incombustible',
  'Terror de las Patatas',
  'Reflejos Ninja',
  'Rey del Sartenazo',
  'Sobreviviente Legendario'
];

// Experience Level Curve: Easy at start, harder later
export function getRequiredXpForLevel(lvl: number): number {
  if (lvl <= 1) return 100;
  // Level 2: 180, Level 3: 280, Level 10: 1200, Level 50: ~12,000, Level 100: ~35,000
  return Math.floor(100 + (lvl - 1) * 80 + Math.pow(lvl - 1, 1.65) * 25);
}

// Battle Pass 100 Tiers Generator
export function generateBattlePassTiers(): BattlePassTier[] {
  const tiers: BattlePassTier[] = [];
  for (let i = 1; i <= 100; i++) {
    const isSpecialSkin = i === 25 || i === 50 || i === 75 || i === 100;
    const isCoins = i % 3 === 0;

    let rewardType: 'coins' | 'skin' | 'hat' | 'trail' = 'coins';
    let rewardName = `+${100 + i * 15} Monedas`;
    let rewardAmount = 100 + i * 15;
    let rewardSkinId: string | undefined = undefined;

    if (i === 25) {
      rewardType = 'skin';
      rewardName = 'Minibomba Ciber-Neón 2099';
      rewardSkinId = 'skin_cyberpunk';
    } else if (i === 50) {
      rewardType = 'skin';
      rewardName = 'Minibomba Magma Volcánico';
      rewardSkinId = 'skin_magma';
    } else if (i === 75) {
      rewardType = 'skin';
      rewardName = 'Minibomba Diamante Puro';
      rewardSkinId = 'skin_diamond';
    } else if (i === 100) {
      rewardType = 'skin';
      rewardName = 'Minibomba Fénix Inmortal';
      rewardSkinId = 'skin_phoenix';
    } else if (isCoins) {
      rewardType = 'coins';
      rewardName = `+${150 + i * 20} Monedas`;
      rewardAmount = 150 + i * 20;
    } else {
      rewardType = 'coins';
      rewardName = `+${80 + i * 10} Monedas`;
      rewardAmount = 80 + i * 10;
    }

    tiers.push({
      level: i,
      requiredXp: getRequiredXpForLevel(i),
      rewardType,
      rewardAmount,
      rewardSkinId,
      rewardName,
      isClaimed: false,
    });
  }
  return tiers;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Bomba_Maestra',
  title: 'El Esquivador',
  avatar: '💣',
  coins: 1600, // Sufficient to buy and test right away
  level: 1,
  currentXp: 40,
  equippedSkin: 'skin_default',
  equippedHat: 'hat_crown',
  equippedTrail: 'trail_fire',
  equippedExplosion: 'exp_classic',
  matchesPlayed: 4,
  victories: 2,
  explosionsSurvived: 18,
  totalPasses: 34,
  winStreak: 1,
  highestStreak: 3,
  claimedPassTiers: [],
};

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.8,
  sfxVolume: 0.85,
  musicVolume: 0.7,
  screenShake: 'extreme',
  particles: 'epic',
  passKey: 'Space',
  sensitivity: 4,
  voiceChatEnabled: true,
  micMuted: false,
  autoPassOnCatch: false,
};

const DEFAULT_ACCOUNT: UserAccount = {
  id: 'guest_user',
  username: 'Bomba_Maestra',
  isGoogle: false,
  isLoggedIn: false,
};

export const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Bautismo de Fuego',
    description: 'Juega 2 partidas frenéticas completas.',
    targetCount: 2,
    currentCount: 0,
    rewardXp: 180,
    rewardCoins: 150,
    isClaimed: false,
    type: 'play_matches',
  },
  {
    id: 'm2',
    title: 'Manos Rápidas',
    description: 'Pasa la patata caliente 8 veces sin estallar.',
    targetCount: 8,
    currentCount: 0,
    rewardXp: 240,
    rewardCoins: 200,
    isClaimed: false,
    type: 'pass_potato',
  },
  {
    id: 'm3',
    title: 'Superviviente de Élite',
    description: 'Llega al Top 3 o gana una partida.',
    targetCount: 1,
    currentCount: 0,
    rewardXp: 350,
    rewardCoins: 300,
    isClaimed: false,
    type: 'survive_top',
  },
];

export class StorageService {
  private static KEYS = {
    PROFILE: 'hp_profile_v3',
    SETTINGS: 'hp_settings_v3',
    SKINS: 'hp_skins_v3',
    HATS: 'hp_hats_v3',
    TRAILS: 'hp_trails_v3',
    EXPLOSIONS: 'hp_explosions_v3',
    MISSIONS: 'hp_missions_v3',
    ACCOUNT: 'hp_account_v3',
  };

  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(this.KEYS.PROFILE);
      if (data) return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  }

  static saveProfile(p: UserProfile): void {
    try {
      localStorage.setItem(this.KEYS.PROFILE, JSON.stringify(p));
    } catch {
      // fallback
    }
  }

  static getAccount(): UserAccount {
    try {
      const data = localStorage.getItem(this.KEYS.ACCOUNT);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return DEFAULT_ACCOUNT;
  }

  static saveAccount(acc: UserAccount): void {
    try {
      localStorage.setItem(this.KEYS.ACCOUNT, JSON.stringify(acc));
    } catch {
      // fallback
    }
  }

  static getMissions(): DailyMission[] {
    try {
      const data = localStorage.getItem(this.KEYS.MISSIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_MISSIONS;
  }

  static saveMissions(missions: DailyMission[]): void {
    try {
      localStorage.setItem(this.KEYS.MISSIONS, JSON.stringify(missions));
    } catch {
      // fallback
    }
  }

  static getSkins(): BombSkin[] {
    try {
      const data = localStorage.getItem(this.KEYS.SKINS);
      if (data) {
        const stored = JSON.parse(data) as BombSkin[];
        return BOMB_SKINS.map((b) => {
          const match = stored.find((s) => s.id === b.id);
          return match ? { ...b, unlocked: match.unlocked } : b;
        });
      }
    } catch {
      // fallback
    }
    return BOMB_SKINS;
  }

  static saveSkins(skins: BombSkin[]): void {
    try {
      localStorage.setItem(this.KEYS.SKINS, JSON.stringify(skins));
    } catch {
      // fallback
    }
  }

  static getAccessories(): BombAccessory[] {
    try {
      const data = localStorage.getItem(this.KEYS.HATS);
      if (data) {
        const stored = JSON.parse(data) as BombAccessory[];
        return BOMB_ACCESSORIES.map((b) => {
          const match = stored.find((s) => s.id === b.id);
          return match ? { ...b, unlocked: match.unlocked } : b;
        });
      }
    } catch {
      // fallback
    }
    return BOMB_ACCESSORIES;
  }

  static saveAccessories(hats: BombAccessory[]): void {
    try {
      localStorage.setItem(this.KEYS.HATS, JSON.stringify(hats));
    } catch {
      // fallback
    }
  }

  static getTrails(): TrailEffect[] {
    try {
      const data = localStorage.getItem(this.KEYS.TRAILS);
      if (data) {
        const stored = JSON.parse(data) as TrailEffect[];
        return TRAIL_EFFECTS.map((b) => {
          const match = stored.find((s) => s.id === b.id);
          return match ? { ...b, unlocked: match.unlocked } : b;
        });
      }
    } catch {
      // fallback
    }
    return TRAIL_EFFECTS;
  }

  static saveTrails(trails: TrailEffect[]): void {
    try {
      localStorage.setItem(this.KEYS.TRAILS, JSON.stringify(trails));
    } catch {
      // fallback
    }
  }

  static getExplosions(): ExplosionEffect[] {
    try {
      const data = localStorage.getItem(this.KEYS.EXPLOSIONS);
      if (data) {
        const stored = JSON.parse(data) as ExplosionEffect[];
        return EXPLOSION_EFFECTS.map((b) => {
          const match = stored.find((s) => s.id === b.id);
          return match ? { ...b, unlocked: match.unlocked } : b;
        });
      }
    } catch {
      // fallback
    }
    return EXPLOSION_EFFECTS;
  }

  static saveExplosions(explosions: ExplosionEffect[]): void {
    try {
      localStorage.setItem(this.KEYS.EXPLOSIONS, JSON.stringify(explosions));
    } catch {
      // fallback
    }
  }

  static getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(this.KEYS.SETTINGS);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(s: GameSettings): void {
    try {
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(s));
    } catch {
      // fallback
    }
  }
}
