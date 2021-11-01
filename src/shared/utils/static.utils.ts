import { Theme } from 'src/modules/statics/enums/themes.enum';

export namespace StaticUtils {
  const defaultDarkProfileImageUrl =
    'http://152.206.177.203:9000/saturday.static/profile-default-male-dark.jpg';
  const defaultLightProfileUrl =
    'http://152.206.177.203:9000/saturday.static/profile-default-male-light.jpg';

  export function getDefaultProfileImageUrl(theme: Theme) {
    if (theme == Theme.Dark) return defaultDarkProfileImageUrl;
    return defaultLightProfileUrl;
  }
}
