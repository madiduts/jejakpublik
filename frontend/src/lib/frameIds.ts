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
