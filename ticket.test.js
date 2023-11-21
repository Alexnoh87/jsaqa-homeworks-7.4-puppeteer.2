const { selectDateTime, orderTickets, orderTicketsQRCode } = require("./lib/util.js");
const { getText } = require("./lib/commands");
  
  let page;
  let tomorrow = "nav.page-nav > a:nth-child(2)";
  let dayAfterTomorrow = "nav.page-nav > a:nth-child(3)";
  let movieTime = "[data-seance-id='174']";
  
    beforeEach(async () => {
      page = await browser.newPage();
      await page.goto("http://qamid.tmweb.ru/client/index.php");
      await page.setDefaultNavigationTimeout(0);
    });
  
    afterEach(() => {
      page.close();
    });
  
describe("Happy path tests", () => {
    test("Booking one ticket tomorrow", async () => {
      await selectDateTime(page, tomorrow, movieTime);
      await orderTickets(page, 2, 3);
      const title = await page.$eval(".ticket__check-title", (link) => link.textContent);
      const selectorButton = await page.$eval("body > main > section > div > button", link => link.textContent);
      expect(title).toContain("Вы выбрали билеты:");
      expect(selectorButton).toContain("Получить код бронирования");
    });

    test("Booking two ticket day after tomorrow", async () => {
        await selectDateTime(page, dayAfterTomorrow, movieTime);
        await orderTickets(page, 2, 3, 4);
        const title = await page.$eval(".ticket__check-title", (link) => link.textContent);
        const selectorButton = await page.$eval("body > main > section > div > button", link => link.textContent);
        expect(title).toContain("Вы выбрали билеты:");
        expect(selectorButton).toContain("Получить код бронирования");
      });
});  
  
describe("Sad path test", () => {
    afterEach(() => {
        page.close();
      });

    test("Booking reserved chair", async () => {
        let row = 2;
        let seat = 9;
        await expect(async () => {
        await selectDateTime(page, tomorrow, movieTime);
        await orderTicketsQRCode(page, row, seat);
        await page.goto("http://qamid.tmweb.ru/client/index.php");
        await selectDateTime(page, tomorrow, movieTime);
        await orderTicketsQRCode(page, row, seat);
      }).rejects.toThrowError("Место(а) занято(ы)");
    });
}); 
  