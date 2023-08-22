const Background = {
  main: async function() {
    await Communication.init();
    await Opts.init();

    await Tabs.init();
  },
};

Background.main();