# SWINGBOXBREAKOUT
# WGRIFFITH2 (C) 2013

INPUT PERIODS = 3;
INPUT FACTOR = 2.0; # ATR FACTOR
INPUT AVGVOL = 60;
INPUT OVERBOUGHT = 40;
INPUT PRICE = CLOSE;
INPUT AVERAGETYPE = {DEFAULT SMA, EMA};

# DEFINING ENTRY
DEF KPERIOD = 14;
DEF DPERIOD = 3;
DEF FASTLINE = ROUND(SIMPLEMOVINGAVG(100 * ((CLOSE - LOWEST(LOW, KPERIOD)) / (HIGHEST(HIGH, KPERIOD) - LOWEST(LOW, KPERIOD))), LENGTH = DPERIOD));
DEF SLOWLINE = ROUND(SIMPLEMOVINGAVG(SIMPLEMOVINGAVG(100*((CLOSE-LOWEST(LOW,KPERIOD))/(HIGHEST(HIGH,KPERIOD)-LOWEST(LOW,KPERIOD))), LENGTH = DPERIOD), LENGTH = DPERIOD));
DEF STOCH = FASTLINE > SLOWLINE AND (FASTLINE[1] <= OVERBOUGHT-20 OR FASTLINE[2] <= OVERBOUGHT-20);

DEF RSI = RSIWILDER()[1] <= OVERBOUGHT;

DEF CHANGE = CLOSE > CLOSE[1];

DEF BUYSIGNAL = VOLUMEAVG(LENGTH = AVGVOL) > VOLUMEAVG(LENGTH = AVGVOL).VOLAVG AND CHANGE IS TRUE;

DEF ENTRY = BUYSIGNAL IS TRUE AND RSI IS TRUE AND STOCH IS TRUE;

# DEFINING EXIT
DEF SHIFT = FACTOR * AVGTRUERANGE(HIGH, CLOSE, LOW, 20);
DEF AVERAGE;
SWITCH (AVERAGETYPE) {
CASE SMA:
    AVERAGE = AVERAGE(PRICE, 20);
CASE EMA:
    AVERAGE = EXPAVERAGE(PRICE, 20);
}
DEF ROLLINGLOW = LOWEST(DATA = LOW(), LENGTH = PERIODS)[1];
DEF STOPLOSS = (LOW <= ROLLINGLOW AND ENTRY IS FALSE);
DEF TARGET = HIGH >= AVERAGE + SHIFT;
DEF EXIT = (TARGET IS TRUE OR STOPLOSS IS TRUE);

DEF SHARES = ROUND(10000 / CLOSE);

#LONG POSITION:
ADDORDER(ORDERTYPE.BUY_TO_OPEN, ENTRY IS TRUE, TRADESIZE = SHARES, TICKCOLOR = GETCOLOR(0), ARROWCOLOR = GETCOLOR(0), NAME = "LE");
ADDORDER(ORDERTYPE.SELL_TO_CLOSE, EXIT IS TRUE, TRADESIZE = SHARES, TICKCOLOR = GETCOLOR(1), ARROWCOLOR = GETCOLOR(1), NAME = "LX", PRICE = OHLC4);

##################################################
