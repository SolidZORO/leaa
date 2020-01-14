import { ModuleMetadata, Provider, Type } from '@nestjs/common/interfaces';
import { InitOptions } from 'i18next';

export interface InitOptionsFactory {
  createCacheOptions(): Promise<InitOptions> | InitOptions;
}

export interface InitAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Injection token resolving to an existing provider. The provider must implement
   * the `InitOptionsFactory` interface.
   */
  useExisting?: Type<InitOptionsFactory>;
  /**
   * Injection token resolving to a class that will be instantiated as a provider.
   * The class must implement the `InitOptionsFactory` interface.
   */
  useClass?: Type<InitOptionsFactory>;
  /**
   * Function returning options (or a Promise resolving to options) to configure the
   * cache module.
   */
  useFactory?: (...args: any[]) => Promise<InitOptions> | InitOptions;
  /**
   * Dependencies that a Factory may inject.
   */
  inject?: any[];
  extraProviders?: Provider[];
}
