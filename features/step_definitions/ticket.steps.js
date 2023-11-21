const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { selectDateTime, orderTickets, orderTicketsQRCode, checkOccupiedSeats } = require("../../lib/util.js");
const { setDefaultTimeout } = require("@cucumber/cucumber");
const { getText } = require("../../lib/commands.js");
setDefaultTimeout(60 * 1000);

let movieTime = "[data-seance-id='174']";
let ticketCheck = ".ticket__check-title";

Before(async function () {
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();
    this.browser = browser;
    this.page = page;
  });
  
  After(async function () {
    if (this.browser) {
      await this.browser.close();
    }
  });
  
  Given("user is on {string} page", async function (string) {
    return await this.page.goto(`http://qamid.tmweb.ru/client${string}`, {
      setTimeout: 40000,
    });
  });
  
  When("user select {int} day and movie", async function (int1) {
    await selectDateTime(
      this.page,
      `nav.page-nav > a:nth-child(${int1})`,
      movieTime
    );
  });
  
  When("select and book {int} row and {int} seat", async function (int1, int2) {
    await orderTickets(this.page, int1, int2);
  });

  When("select and book with QR code {int} row and {int} seat", async function (int1, int2) {
    await orderTicketsQRCode(this.page, int1, int2);
  });
  
  When(
    "select and book {int} row and {int},{int} seats", async function (int1, int2, int3) {
      await orderTickets(this.page, int1, int2, int3);
    }
  );
  
  When(
    "user selects the occupied {int} row and {int} seat", async function (int1, int2) {
      await checkOccupiedSeats(this.page, int1, int2);
      try {
        await orderTickets(this.page, int1, int2);
      } catch (error) {
        expect(error).to.be.an("error");
        expect(error.message).to.be.equal("Место(а) занято(ы)");
      }
    }
  );
  
  Then("user received confirmation", async function () {
    const actual = await getText(this.page, ticketCheck);
    expect(actual).contain("Вы выбрали билеты:");
  });

  
  Then("Book button is not active", async function () {
    const buttonStatus = await this.page.$eval(
      ".acceptin-button",
      (el) => el.disabled
    );
    expect(buttonStatus).equal(true);
  });