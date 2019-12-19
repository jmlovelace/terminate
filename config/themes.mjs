class Theme {
  constructor (stylesheet, faviconMap) {
    this.stylesheet = stylesheet;
    this.favicons = faviconMap;
  }
}

class Themes {
  constructor() {
    this.list = new Map();
    
    // CONFIG
    const themeDir = '../styles/themes/';
    const themeExt = 'css';
    
    const faviconDir = '../media/favicons/';
    const faviconExt = 'ico';
    this.faviconRes = ['16', '32'];
    
    const themeNames = [
      'cyberwave',
      'hardline',
      'matrix',
      'solarized-dark'
    ];
    
    const ambient = 'cyberwave'; // default theme from among the above
    const hardline = 'hardline'; // default hardline theme from among the above
    
    // Insert all the themes!
    themeNames.forEach(
      themeName => this.list.set(
        themeName, new Theme(
          `${themeDir}${themeName}.${themeExt}`,
          this.faviconRes.reduce(
            (map, res) => map.set(res, `${faviconDir}${themeName}-${res}.${faviconExt}`),
            new Map()
          )
        )
      )
    );
    
    
    this.list
      .set('ambient', this.list.get(ambient))
      .set('hardline', this.list.get(hardline));
  }
  
  setTheme (themeName) {
    let theme = this.list.get(themeName);
    document.getElementById('theme').setAttribute('href', theme.stylesheet);
    for (let res of theme.favicons.keys()) {
      document.getElementById(`favicon${res}`).setAttribute('href', theme.favicons.get(res));
    }
  }
}

let themes = new Themes();

export default themes;
