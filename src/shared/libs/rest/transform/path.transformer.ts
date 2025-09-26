import { inject, injectable } from 'inversify';
import { Components } from '../../../types/components.enum.js';
import { RestSchema } from '../../config/rest.schema.js';
import { Config } from '../../config/config.interface.js';
import { Logger } from '../../logger/logger.interface.js';
import { DEFAULT_STATIC_IMAGES, STATIC_RESOURCE_FIELDS } from './path.transformer.constant.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from '../../../../apps/rest/rest.constants.js';
import { getFullServerPath } from '../../../helpers/common.js';

function isObject(value: unknown): value is Record<string, object> {
  return typeof value === 'object' && value !== null;
}

@injectable()
export class PathTransformer {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,
    @inject(Components.RestConfig)
    private readonly config: Config<RestSchema>,
  ) {
    this.logger.info('PathTransformer created!');
  }

  private hasDefaultImage(value: string): boolean {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(prop: string) {
    return STATIC_RESOURCE_FIELDS.includes(prop);
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];
    while (stack.length > 0) {
      const current = stack.pop();
      if (current) {
        for (const key in current) {
          if (Object.hasOwn(current, key)) {
            const value = current[key];

            if (isObject(value)) {
              stack.push(value);
              continue;
            }

            if (this.isStaticProperty(key) && typeof value === 'string' && value.length > 0) {
              const staticPath = STATIC_FILES_ROUTE;
              const uploadPath = STATIC_UPLOAD_ROUTE;
              const serverHost = this.config.get('HOST');
              const serverPort = this.config.get('PORT');

              const rootPath = this.hasDefaultImage(value) ? staticPath : uploadPath;
              current[key] = `${getFullServerPath(serverHost, serverPort)}${rootPath}/${value}`;
            }
          }
        }
      }
    }
    return data;
  }
}
