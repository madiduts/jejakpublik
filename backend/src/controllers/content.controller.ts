import type { Context } from 'hono';
import { ContentModel } from '../models/content.model.js';

export class ContentController {
  static getGlossary(c: Context) {
    const category = c.req.query('category');
    let data = ContentModel.getGlossary();

    if (category) {
      data = data.filter((item) => item.category.toLowerCase().includes(category.toLowerCase()));
    }

    return c.json({
      success: true,
      total: data.length,
      data
    });
  }

  static getAbout(c: Context) {
    const data = ContentModel.getAbout();
    return c.json({
      success: true,
      data
    });
  }

  static getGuide(c: Context) {
    const data = ContentModel.getGuide();
    return c.json({
      success: true,
      data
    });
  }
}
