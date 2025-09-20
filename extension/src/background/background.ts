const bg = async () => {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === "toggle-sidebar") {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: "inject-sidebar" });
      } else {
        console.log("no tab");
      }
    }
  });

  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
};

bg();
