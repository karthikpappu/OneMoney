declare upper;
declare once_per_bar;
input length = 10;
input OpenTime = 0930;
input PositiveRateThreshold = 50;
input ResetByNewTradingDay = yes;


def durationSec = 30 ;
def secondsPassed = SecondsFromTime(OpenTime);
def isNew = if secondsPassed >= 0 and secondsPassed <= durationSec then ResetByNewTradingDay else no;

def value = close;

# Average Tick
def barIdx = if (isNew == yes ) then 1 else barIdx[1]+1;
def totalTickVal = if (isNew == yes ) then value else  totalTickVal[1]+value;
def avgTickVal = totalTickVal / barIdx;
AddLabel(yes, "Average Tick:" + avgTickVal, if avgTickVal > 0 then Color.LIGHT_GREEN else  Color.LIGHT_RED);


# Positive Rate
def upCount = if (isNew == yes and value > 0) then 1 else if (isNew == yes and value < 0) then 0  else if (isNew == no and value > 0 ) then  upCount[1]+1 else upCount[1];

def downCount = if (isNew == yes and value < 0) then 1 else if (isNew == yes and value > 0) then 0  else if (isNew == no and value < 0 ) then  downCount[1]+1 else downCount[1];

def rate =  (upCount / (upCount + downCount)) * 100.0;


def avgRate = MovingAverage(AverageType.SIMPLE, rate, length);

plot avgRateLine = avgRate;

avgRateLine.AssignValueColor(if avgRate > PositiveRateThreshold then Color.GREEN else  Color.RED);
avgRateLine.SetLineWeight(2);

AddLabel(yes, "PositiveRate:" + avgRate, if avgRate > PositiveRateThreshold then Color.GREEN else  Color.RED);