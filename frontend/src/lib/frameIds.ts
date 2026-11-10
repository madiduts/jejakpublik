/** Id node Figma per frame, dipakai untuk anotasi parity. */
export interface NavItemIds {
  outer?: string;
  wrap: string;
  text: string;
  w: number;
}

export interface NavIds {
  iconGlyph?: string;
  head: string;
  brand: string;
  brandText: string;
  links: string;
  items: NavItemIds[];
  gap: string;
  icon: string;
  cta: string;
  ctaText: string;
}

export interface FootColIds {
  box: string;
  headWrap: string;
  head: string;
  bodyWrap: string;
  body: string;
}

export interface FootIds {
  compact?: boolean;
  wrap: string;
  foot: string;
  brandWrap: string;
  brand: string;
  colsWrap: string;
  cols: string;
  col: FootColIds[];
  legal: string;
}

export const NAV_203: NavIds = {
  head: '203:3', brand: '203:4', brandText: '203:5', links: '203:7',
  items: [
    { wrap: '203:8', text: '203:9', w: 51 },
    { wrap: '203:11', text: '203:12', w: 79 },
    { wrap: '203:13', text: '203:14', w: 54 },
    { wrap: '203:15', text: '203:16', w: 50 },
  ],
  gap: '203:17', icon: '203:18', cta: '203:21', ctaText: '203:22',
};

export const NAV_204: NavIds = {
  head: '204:3', brand: '204:4', brandText: '204:5', links: '204:7',
  items: [
    { wrap: '204:8', text: '204:9', w: 51 },
    { outer: '204:18', wrap: '204:11', text: '204:12', w: 81 },
    { wrap: '204:14', text: '204:15', w: 54 },
    { wrap: '204:16', text: '204:17', w: 50 },
  ],
  gap: '204:19', icon: '204:20', cta: '204:23', ctaText: '204:24',
};

export const FOOT_203: FootIds = {
  wrap: '203:238', foot: '203:202', brandWrap: '203:203', brand: '203:204',
  colsWrap: '203:236', cols: '203:206',
  col: [
    { box: '203:207', headWrap: '203:208', head: '203:209', bodyWrap: '203:214', body: '203:211' },
    { box: '203:215', headWrap: '203:216', head: '203:217', bodyWrap: '203:220', body: '203:218' },
    { box: '203:221', headWrap: '203:222', head: '203:223', bodyWrap: '203:226', body: '203:224' },
    { box: '203:227', headWrap: '203:228', head: '203:229', bodyWrap: '203:232', body: '203:230' },
  ],
  legal: '203:233',
};

export const FOOT_204: FootIds = {
  wrap: '204:265', foot: '204:229', brandWrap: '204:230', brand: '204:231',
  colsWrap: '204:263', cols: '204:233',
  col: [
    { box: '204:234', headWrap: '204:235', head: '204:236', bodyWrap: '204:241', body: '204:238' },
    { box: '204:242', headWrap: '204:243', head: '204:244', bodyWrap: '204:247', body: '204:245' },
    { box: '204:248', headWrap: '204:249', head: '204:250', bodyWrap: '204:253', body: '204:251' },
    { box: '204:254', headWrap: '204:255', head: '204:256', bodyWrap: '204:259', body: '204:257' },
  ],
  legal: '204:260',
};

export const NAV_235: NavIds = {
  head: '235:3', brand: '235:4', brandText: '235:5', links: '235:7',
  items: [
    { wrap: '235:8', text: '235:9', w: 51 },
    { outer: '235:18', wrap: '235:11', text: '235:12', w: 81 },
    { wrap: '235:14', text: '235:15', w: 54 },
    { wrap: '235:16', text: '235:17', w: 50 },
  ],
  gap: '235:19', icon: '235:20', cta: '235:23', ctaText: '235:24', iconGlyph: '235:21',
};

export const NAV_247: NavIds = {
  head: '247:3', brand: '247:4', brandText: '247:5', links: '247:7',
  items: [
    { wrap: '247:8', text: '247:9', w: 51 },
    { outer: '247:18', wrap: '247:11', text: '247:12', w: 81 },
    { wrap: '247:14', text: '247:15', w: 54 },
    { wrap: '247:16', text: '247:17', w: 50 },
  ],
  gap: '247:19', icon: '247:20', cta: '247:23', ctaText: '247:24', iconGlyph: '247:21',
};

export const FOOT_235: FootIds = {
  wrap: '235:352', foot: '235:342', brandWrap: '235:343', brand: '235:344',
  colsWrap: '', cols: '', col: [], legal: '235:346', compact: true,
};

export const FOOT_247: FootIds = {
  wrap: '247:366', foot: '247:356', brandWrap: '247:357', brand: '247:358',
  colsWrap: '', cols: '', col: [], legal: '247:360', compact: true,
};

export const NAV_219: NavIds = {
  head: '219:3', brand: '219:4', brandText: '219:5', links: '219:7',
  items: [
    { wrap: '219:8', text: '219:9', w: 51 },
    { wrap: '219:11', text: '219:12', w: 79 },
    { outer: '219:18', wrap: '219:13', text: '219:14', w: 56 },
    { wrap: '219:16', text: '219:17', w: 50 },
  ],
  gap: '219:19', icon: '219:20', cta: '219:23', ctaText: '219:24', iconGlyph: '219:21',
};

export const FOOT_219: FootIds = {
  wrap: '219:158', foot: '219:122', brandWrap: '219:123', brand: '219:124',
  colsWrap: '219:156', cols: '219:126',
  col: [
    { box: '219:127', headWrap: '219:128', head: '219:129', bodyWrap: '219:134', body: '219:131' },
    { box: '219:135', headWrap: '219:136', head: '219:137', bodyWrap: '219:140', body: '219:138' },
    { box: '219:141', headWrap: '219:142', head: '219:143', bodyWrap: '219:146', body: '219:144' },
    { box: '219:147', headWrap: '219:148', head: '219:149', bodyWrap: '219:152', body: '219:150' },
  ],
  legal: '219:153',
};

export const NAV_222: NavIds = {
  head: '222:3', brand: '222:4', brandText: '222:5', links: '222:7',
  items: [
    { wrap: '222:8', text: '222:9', w: 51 },
    { wrap: '222:11', text: '222:12', w: 79 },
    { wrap: '222:13', text: '222:14', w: 54 },
    { outer: '222:18', wrap: '222:15', text: '222:16', w: 50.438 },
  ],
  gap: '222:19', icon: '222:20', cta: '222:23', ctaText: '222:24', iconGlyph: '222:21',
};

export const FOOT_222: FootIds = {
  wrap: '222:198', foot: '222:162', brandWrap: '222:163', brand: '222:164',
  colsWrap: '222:196', cols: '222:166',
  col: [
    { box: '222:167', headWrap: '222:168', head: '222:169', bodyWrap: '222:174', body: '222:171' },
    { box: '222:175', headWrap: '222:176', head: '222:177', bodyWrap: '222:180', body: '222:178' },
    { box: '222:181', headWrap: '222:182', head: '222:183', bodyWrap: '222:186', body: '222:184' },
    { box: '222:187', headWrap: '222:188', head: '222:189', bodyWrap: '222:192', body: '222:190' },
  ],
  legal: '222:193',
};
