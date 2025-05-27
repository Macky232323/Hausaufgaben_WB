/**
 * Berechnet den Schaden, den ein Angriff anrichtet.
 * @param {object} attacker - Das angreifende Pokémon.
 * @param {object} defender - Das verteidigende Pokémon.
 * @param {object} move - Der Angriff, der ausgeführt wird.
 * @returns {number} Der Schaden, den der Angriff anrichtet.
 */
export function damage(attacker, defender, move) {
  if(move.dmg_class === 'status'){
    return 0;
  }
  // 1. Level-Faktor und Basisschaden
  const lvlFactor = Math.floor(25*(2/5)+2);  // ⎣2L/5+2⎦ :contentReference[oaicite:4]{index=4}
  const attackStat = (move.dmg_class === 'physical')
    ? attacker.attack
    : attacker.special_attack;
  const defenseStat = (move.dmg_class === 'physical')
    ? defender.defense
    : defender.special_defense;
  const baseDamage = Math.floor(lvlFactor * move.dmg_power * attackStat / (50 * defenseStat) + 2); // +2 am Ende :contentReference[oaicite:5]{index=5}

  // 3. Zufallsfaktor (85–100)
  const rand = (85 + Math.floor(Math.random() * 16)) / 100; // Z/100 :contentReference[oaicite:7]{index=7}

  // 4. STAB (Typen-Bonus)
  const hasSTAB = attacker.typen_api.find(t => t === move.dmg_typ);
  const stab = hasSTAB ? 1.5 : 1.0;                           // STAB :contentReference[oaicite:8]{index=8}

  // 5. Typ-Effektivität

  const typeEffect = getTypeEffectiveness(move.dmg_typ, defender.typen_dmg_relations);

  // IST NUR FÜR DAS AILMENT "burn"
  // 6. Weitere Faktoren F1, F2, F3 (Fähigkeiten, Wetter, Z-Moves usw.)
  /* const f1 = env.abilityFactor  || 1.0;  // z.B. Techniker

  // 7. Gesamter Modifier
  /* const modifier = crit * f1 * f2 * rand * stab * typeEffect * f3; */
  const modifier = rand * stab * typeEffect;

  // 8. Endgültiger Schaden (abrunden)
  return Math.floor(baseDamage * modifier);                     // Endgültiges Floor :contentReference[oaicite:9]{index=9}
}

function getTypeEffectiveness(moveType, defDmgRelations) {
  const relationsT1 = defDmgRelations[0];
  
  if (relationsT1.no_damage_from.some(t => t.name === moveType)) return 0;
  
  if (relationsT1.double_damage_from.some(t => t.name === moveType)) return 2;

  if (relationsT1.half_damage_from.some(t => t.name === moveType)) return 0.5;

  if(!defDmgRelations[1]){
    return 1;
  }

  const relationsT2 = defDmgRelations[1];

  if (relationsT2.no_damage_from.some(t => t.name === moveType)) return 0;
  
  if (relationsT2.double_damage_from.some(t => t.name === moveType)) return 2;

  if (relationsT2.half_damage_from.some(t => t.name === moveType)) return 0.5;

  return 1;
  
}

export function dot() {

}

/**
 * Wendet ein Ailment (Statusveränderung) an, wenn der Move eines hat.
 * @param {object} attacker - Das angreifende Pokémon.
 * @param {object} defender - Das verteidigende Pokémon.
 * @param {object} move - Der Move, der ausgeführt wird.
 * @returns {object} Das veränderte Verteidiger-Pokémon.
 */
export function ailment(defender, move) {
  // Prüfe, ob der Move ein Ailment auslösen kann
  if (!move.ailment || move.ailment === "none") return defender;

  // Prüfe, ob das Ailment schon besteht
  if (defender.ailment && defender.ailment !== "none") return defender;

  // Prüfe, ob das Ailment ausgelöst wird (Chance)
  const chance = move.ailment_chance || 100;
  if (Math.random() * 100 > chance) return defender;

  // Status setzen
  return { ...defender, ailment: move.ailment };
}

