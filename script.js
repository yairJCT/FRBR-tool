//FRBR algorithm

var error = false;
var message = '';
var record2;
var record1;
var PNX1;
var PNX2;
var key1;
var key2;
var comb;
var metadata = ["date", "issn", "doi","volume", "issue",
                "firstAuthor","invertedFirstAuthor","fullBtitle",
                "briefBtitle", "PMID","ERICBrief","briefTitleV2",
                "briefERIC","briefSICI"];

document.querySelector('.btn-new').addEventListener('click', function() {

    PNX1 = document.querySelector('.insert-pnx1').value;
    PNX2 = document.querySelector('.insert-pnx2').value;
    var options = 0;
    var tryToMatch = 0;
    var lockSummay = false;
    _pnx1 = PNX1;
    _pnx2 = PNX2;

    var r1 = _pnx1.split('');
    var r2 = _pnx2.split('');

    if(r2.length == 0 && r1.length == 0){
    error = true;
    messageBox("Enter data in both record boxes!");
     return;
    }
    if(r1.length == 0){
    messageBox('Enter data in record 1 box');
     return;
    }
    if(r2.length == 0){
    messageBox('Enter data in record 2 box');
     return;
    }

    var firstRecordID = getTag('recordid', r1);
    if(firstRecordID==0)
        firstRecordID = 'Record 1';

    var secondRecordID = getTag('recordid', r2);
    if(secondRecordID ==0)
        secondRecordID = 'record 2';


    record1 ={
        recordid: firstRecordID,
        1:getTag('k1', r1), // date
        2:getTag('k2', r1), // issn
        3:getTag('k3', r1), // doi
        4:getTag('k4', r1), // volume
        5:getTag('k5', r1), // issue
        6:getTag('k6', r1), // firstAuthor
        7:getTag('k7', r1), // invertedFirstAuthor
        8:getTag('k8', r1), //  fullBtitle
        9:getTag('k9', r1), // briefBtitle
        10:getTag('k10', r1), // PMID
        11:getTag('k11', r1), // ERICBrief
        12:getTag('k12', r1), // briefTitleV2
        13:getTag('k13', r1), // briefERIC
        14:getTag('k14', r1), // briefSICI
    };
    record2 = {
        recordid: secondRecordID,
        1:getTag('k1', r2), // date
        2:getTag('k2', r2), // issn
        3:getTag('k3', r2), // doi
        4:getTag('k4', r2), // volume
        5:getTag('k5', r2), // issue
        6:getTag('k6', r2), // firstAuthor
        7:getTag('k7', r2), // invertedFirstAuthor
        8:getTag('k8', r2), //  fullBtitle
        9:getTag('k9', r2), // briefBtitle
        10:getTag('k10', r2), // PMID
        11:getTag('k11', r2), // ERICBrief
        12:getTag('k12', r2), // briefTitleV2
        13:getTag('k13', r2), // briefERIC
        14:getTag('k14', r2), // briefSICI
    };
    console.log(metadata);
    console.log(record1);
    console.log(record2);


    // type
    var type1 = 0;
    var type2 = 0;
    var tagHit1 = false;
    var tagHit2 = false;
    var ableMessage = true;
    // scan type

    for (var i =0, len = r1.length+r2.length; i < len; i++)
        {
            if(tagHit1 == false&&r1[i]=='<'&&r1[i+1]=='t'&& r1[i+2]=='>')
                {
                type1 = r1[i+3];
                tagHit1 = true;
                }

            if(tagHit2 == false&&r2[i]=='<'&&r2[i+1]=='t'&& r2[i+2]=='>')
                {
                type2 = r2[i+3];
                tagHit2 = true;
                }
            if(tagHit1&&tagHit2)
                break;

        }
    if(type1*type2 == 0){
        messageBox('FRBR type is missing in one record or more')
        return;
    }
    if(type1 == 99&&type2 == 99 )
        {
            messageBox('FRBR types are 99 - not for grouping')
            return;
        }
    if(type1!= type2){

        messageBox('FRBR types are not identical!');
        messageBox('=============================');


        messageBox(record1.recordid + ' is type ' + type1);
        messageBox(record2.recordid + ' is type ' + type2);
        return;
    }

    // continue test
    var atleastOneMatch = false;
    key1 = new Array(14);
    key2 = new Array(14);
    comb = new Array(14); for (var i = 0; i < comb.length; ++i) { comb[i] = false; }
    var matchBy = new Array(14); for (var i = 0; i < matchBy.length; ++i) { matchBy[i] = false; }


    // find identical keys for both records
    for (var i = 0; i < key1.length; ++i)
        {
            key1[i] = getTag('k'+(i+1).toString(), r1)
            key2[i] = getTag('k'+(i+1).toString(), r2)
            if(key1[i] == key2[i] && key1[i]!= '0')
                comb[i] = true;

        }

    if(type1 == 2)
        checkType2Combinations();

    if(type1 == 3)
        checkType3Combinations();

    if(!atleastOneMatch){
        if(tryToMatch == 0 && ableMessage == true)
        messageBox('====== There is NO match! =======');

        tryToMatch++;
        if(type1 ==2)
        matchSuggestForT2(matchBy);

        else
        matchSuggestForT3(matchBy);
    }

function checkType2Combinations(){
          console.log("%% enter Type 2 match");
    for (var j = 0, len2=comb.length; j < len2; j++)
    console.log("comb["+j+"] = "+comb[j])

        atleastOneMatch = false;
         if(comb[2]){
             matchBy[2] = true;
             if(comb[0])
                 {
                     matchBy[0] = true;
                     if(!atleastOneMatch)
                        atleastOneMatch = true;

                     options = matchSummary(matchBy,options, record1, 0);
                 }
             if(comb[8])
                 {
                  matchBy[8] = true;
                  if(!atleastOneMatch)
                     atleastOneMatch = true;

                     options = matchSummary(matchBy,options, record1, 8);
                 }

             matchBy[2] = false;
         }

    if(comb[3] == true && comb[4] == true)
    {
        matchBy[3] = true;
        matchBy[4] = true;
        if(comb[1])
            {
            matchBy[1] = true;
            if(comb[8])
                {
                 matchBy[8] = true;
                 if(!atleastOneMatch)
                 atleastOneMatch = true;
                  options = matchSummary(matchBy,options, record1,8);
                }
                matchBy[1] = false;
            }
        if(comb[11])
            {
            matchBy[11] = true;
            if(comb[6])
                {
                    matchBy[6] = true;
                    if(comb[5])
                    {
                       matchBy[5] = true;
                       if(!atleastOneMatch)
                       atleastOneMatch = true;

                       options = matchSummary(matchBy,options, record1, 5);
                        matchBy[6] = false;

                    }
                    else if(comb[8])
                    {
                        matchBy[11] = false;

                                matchBy[8] = true;
                                if(!atleastOneMatch)
                                atleastOneMatch = true;
                                 options = matchSummary(matchBy,options, record1, 8);
                    }
                 }
                if(comb[1])
                    {
                        matchBy[1] = true;
                        if(comb[5])
                            {
                                matchBy[5] = true;
                                if(!atleastOneMatch)
                                atleastOneMatch = true;
                                options = matchSummary(matchBy,options, record1, 5);

                            }
                        matchBy[1] = false;

                    }
                matchBy[11] = false;
            }
            if(comb[6])
            {
                matchBy[6] = true;
                if(comb[8])
                    {
                        matchBy[8] = true;
                        if(!atleastOneMatch)
                        atleastOneMatch = true;
                        options = matchSummary(matchBy,options, record1, 8);
                    }
                matchBy[6] = false;

            }
        matchBy[3] = false;
        matchBy[4] = false;
            }
            if(comb[11]) // k12 true
                {
                    matchBy[11] = true;
                    if(comb[2]) // k3 true
                        {
                            matchBy[2] = true;
                            if(!atleastOneMatch)
                                atleastOneMatch = true;

                             options = matchSummary(matchBy,options, record1, 2);
                        }
                    if(comb[9])
                        {
                            matchBy[9] = true;
                            if(!atleastOneMatch)
                                atleastOneMatch = true;

                            options = matchSummary(matchBy,options, record1, 9);

                        }
                    if(comb[10])
                        {
                            matchBy[10] = true;
                            if(!atleastOneMatch)
                                atleastOneMatch = true;

                            options = matchSummary(matchBy,options, record1, 10);

                        }
                    if(comb[12])
                        {
                            matchBy[12] = true;
                            if(!atleastOneMatch)
                                atleastOneMatch = true;

                             options = matchSummary(matchBy,options, record1, 12);
                            return atleastOneMatch;
                        }
                    if(comb[13])
                        {
                            matchBy[13] = true;
                            if(!atleastOneMatch)
                                atleastOneMatch = true;

                             options = matchSummary(matchBy,options, record1, 13);
                            return atleastOneMatch;
                        }

                    matchBy[11] = false;

                }

console.log("End Type 2 match: = "+atleastOneMatch);
return atleastOneMatch;
}
function checkType3Combinations(){

        if(comb[7]){
            matchBy[11] = false;
            matchBy[7] = true;
            if(comb[5]){
                matchBy[5] = true;

            if(!atleastOneMatch)
                atleastOneMatch = true;
            options = matchSummary(matchBy,options, record1, 5);
            }
            if(comb[6]){
                matchBy[6] = true;

            if(!atleastOneMatch)
                atleastOneMatch = true;
            options = matchSummary(matchBy,options, record1, 6);
            }
            matchBy[7] = false;
        }
       if(comb[8]){

           matchBy[8] = true;
           if(comb[1]){
               matchBy[1] = true;

       if(!atleastOneMatch)
             atleastOneMatch = true;
            options = matchSummary(matchBy,options, record1, 1);
           }
           if(comb[2]){
               matchBy[2] = true;
           if(!atleastOneMatch)
             atleastOneMatch = true;
            options = matchSummary(matchBy,options, record1, 2);
           }
           matchBy[8] = false;
       }
         if(comb[11]) // k12 true
         {
             matchBy[11] = true;
             if(comb[1])
                 {
                     matchBy[1] = true;
                     if(!atleastOneMatch)
                        atleastOneMatch = true;

                     options = matchSummary(matchBy,options, record1, 1);
                 }

             if(comb[2])
                 {
                     matchBy[2] = true;
                     if(!atleastOneMatch)
                        atleastOneMatch = true;

                     options = matchSummary(matchBy,options, record1, 2);
                 }
             if(comb[3])
                 {
                     matchBy[3] = true;
                     if(!atleastOneMatch)
                        atleastOneMatch = true;
                      options = matchSummary(matchBy,options, record1, 3);
                 }
             if(comb[4])
                 {
                     matchBy[4] = true;
                     if(!atleastOneMatch)
                        atleastOneMatch = true;
                      options = matchSummary(matchBy,options, record1, 4);
                 }
             if(comb[9])
                 {
                     matchBy[9] = true;
                     if(!atleastOneMatch)
                        atleastOneMatch = true;
                      options = matchSummary(matchBy,options, record1, 9);
                 }
             if(comb[10])
                 {
                     matchBy[10] = true;
                     if(!atleastOneMatch)
                        atleastOneMatch = true;
                      options = matchSummary(matchBy,options, record1, 10);
                 }
         }
    return atleastOneMatch;
    }
function messageBox(xxx){

    $(document).ready(function() {
    var boxHeight = $('.message-box').height();
    $('.message-box').css('height', boxHeight+45+'px');

    var panelHeight = $('.wrapper').height();
    $('.wrapper').css('height', panelHeight+17+'px');
    $('body').css('height', $('.wrapper').height());

    // change record 1/2 location
    });

    var mainBox = document.querySelector('.message-box');
    mainBox.style.display = 'block';
    //mainBox.stye.color = 'red';
    $('.message-box').append(xxx + "\n");
    $('.player-0-panel').text(record1.recordid);
    $('.player-1-panel').text(record2.recordid);






}
function getTag(tag, n){

        var charTag = tag.split('');
        var found = false;
        var value = '';
        var i = 0;

if(n[0] == '<' && n[1] == '?')
i = 35;

if(tag == 't')
    {
        for (i, len = n.length; i < len; i++)
        {

            if(found == false && n[i] == '<' && n[i+1] == charTag[0] && n[i+2] == '>')
            {
                found == true;
                return n[i+3];
            }
        }
    }



if(tag =='k1') {
    for (i, len = n.length; i < len; i++)
    {
       if(n[i] == '<' && n[i+1] == 'k' && n[i+2] =='1' && n[i+3] =='>')
           {
               console.log('enter k1 getTag')
               found = true;
               i +=2;
               break;
           }
    }
}

if(found == false){
for (i, len = n.length ;i < len; i++)
{
if(n[i] == '<' && n[i+1] == charTag[0] && n[i+2] == charTag[1])
{
    var trueValue = true;
    for (var j = 0, len2 = charTag.length; j < len2; j++){
            i++;
            if(n[i] != charTag[j])
                trueValue = false;
        }
    if(trueValue == true) {
        found = true;
        break;
        }
}
}
}
if(!found)
return '0';


i += 2;
console.log("tag = " + tag);
while(n[i]!='<'|| n[i+1]!='/')
{
    value += n[i];
    i++;
}
return value;
}
function matchSummary(matchKeys, option, record, returnFalseIndex){
    if(lockSummay)
        return;
    if(option == 0)
    {
    messageBox(record1.recordid + " and " + record2.recordid + " match!");
    messageBox("");
    messageBox("========== match is done by: ==========");
    messageBox("");
    }
    var firstMatch = false;
    if(option!=0)
        {
        messageBox("")
        messageBox("============== or by ==============");
        messageBox("");
        }

    for (i = 0, len = matchKeys.length; i < len; i++)
        {
            if(i!=0 && firstMatch == true && matchKeys[i] == true)
                messageBox(" + ");

            if(matchKeys[i] == true){
             firstMatch = true;

             messageBox('(k'+(i+1)+') ' + metadata[i] + ': ' + record[i+1] );
            }
        }
    option++;
    matchKeys[returnFalseIndex] = false;
    return(++option);
}
function matchSuggestForT2(matchKeys){

   lockSummay = true;
   messageBox("")
   messageBox('Matching offers:')
   messageBox("")
  // console.log("######## Enter matchSuggestForT2")
   var firstOption = true;


/*
    0 - no record has key
    1 - only record 1 has key
    2 - only record 2 has key
    3 - both have same key
    4 - both have keys, but not same
*/
    var machKey = new Array(14);
    for (var i = 0; i < machKey.length; ++i) {
       if(comb[i] == true)
           {
           machKey[i] = 3;
           continue;
           }
       if(key1[i] == 0 && key2[i] == 0)
           {
           machKey[i] = 0;
           continue;
           }
       else if(key1[i]!= 0 && key2[i] == 0)
           {
               machKey[i] = 1;
               continue;
           }
       else if(key1[i] == 0 && key2[i]!=0)
           {
               machKey[i] = 2;
               continue;
           }
        else if(key1[i]!= key2[i] && key1[i]!=0 && key2[i]!=0)
            machKey[i] = 4;
}

    ableMessage = false;
    var isAmatchBy = false;
    var numberOfop = 1;
    var poorRecord = record2.recordid;
    for (i = 0; i < comb.length; i++){
        if(key1[i] == key2[i] && key1[i]!= '0')
            comb[i] = true;

   /*
    0 - no record has key
    1 - only record 1 has key
    2 - only record 2 has key
    3 - both have same key
    4 - both have keys, but not same
*/
}
   /* give DOI prioraty*/

    for (i = 0; i < comb.length; i++){
        if(comb[i] == false) // key is missing with atleast one
            isAmatchBy = completeTagOneKey(i)

    if(isAmatchBy == true)
        {

            ableMessage = true;
            completeTagOneKey(i);
            ableMessage = false;
            isAmatchBy = false;
        }
    }
/*    var j = 0;
    for (i = 0; i < comb.length; i++){
        if(comb[j] == false && comb[i] == false) // key is missing with atleast one
            isAmatchBy = completeTagTwoKey(j,i);

    if(isAmatchBy == true)
        {

            ableMessage = true;
            isAmatchBy = completeTagTwoKey(j,i);
            ableMessage = false;
            isAmatchBy = false;
        }
        if(i == comb.length -1 && j<comb.length)
            {
                i = 0;
                j +=1;
            }
    }*/


    function completeTagOneKey(k)
    {
        comb[k] = true;
        var newMach = checkType2Combinations();
        comb[k] = false;

        if(!ableMessage)
                return newMach;


        if(machKey[k] == 0)
            {
             messageBox(numberOfop++ + ')' + " add " + metadata[k]+"(k"+(k+1)+")" + " to both records");
             messageBox("");

            }
        if(machKey[k] == 1)
            {
                poorRecord = record2.recordid;
                if(newMach)
                {
                    ableMessage = true;
                    messageBox(numberOfop++ + ')' + " add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                    if(poorRecord == record2.recordid)
                        messageBox(metadata[k] +" is: " + record1[3]);
                    else
                        messageBox(metadata[k] +" is: " + record2[3]);

                    messageBox("");
                }


            }

        if(machKey[k] == 2){
                poorRecord = record1.recordid;
            if(newMach)
                {
                    ableMessage = true;
                    messageBox(numberOfop++ + ')' + " add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                    if(poorRecord == record1.recordid)
                        messageBox(metadata[k] +" is: " + record2[3]);
                    else
                        messageBox(metadata[k] +" is: " + record1[3]);

                    messageBox("");
                }
        }
        if(machKey[k] == 4){
         ableMessage = true;
         messageBox(numberOfop++ + ')' + " change the " + metadata[k] +"(k"+(k+1)+")" +" in one of the records");
         messageBox("======= >              < =======")
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record1.recordid+": " + record1[k+1]);
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record2.recordid+": " + record2[k+1]);
         messageBox("");
        }

        return newMach;
    }
    function completeTagTwoKey(k, l)
    {
        comb[k] = true;
        comb[l] = true;
        var newMach = checkType2Combinations();
        comb[k] = false;
        comb[l] = false;

        if(!ableMessage)
                return newMach;

if(machKey[l] == 0)
        {
         messageBox(numberOfop++ + ')' + " add " + metadata[l]+"(k"+(l+1)+")" + " to both records");
         messageBox("AND");
       if(machKey[k] == 1)
        {
            poorRecord = record2.recordid;
            if(newMach)
            {
                ableMessage = true;
                messageBox(" add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                if(poorRecord == record2.recordid)
                    messageBox(metadata[k] +" is: " + record1[3]);
                else
                    messageBox(metadata[k] +" is: " + record2[3]);

                messageBox("");
            }


        }

    if(machKey[k] == 2){
            poorRecord = record1.recordid;
        if(newMach)
            {
                ableMessage = true;
                messageBox( " add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                if(poorRecord == record1.recordid)
                    messageBox(metadata[k] +" is: " + record2[3]);
                else
                    messageBox(metadata[k] +" is: " + record1[3]);

                messageBox("");
            }
        }
        if(machKey[k] == 4){
         ableMessage = true;
         messageBox("change the " + metadata[k] +"(k"+(k+1)+")" +" in one of the records");
         messageBox("======= >              < =======")
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record1.recordid+": " + record1[k+1]);
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record2.recordid+": " + record2[k+1]);
        }


        }
if(machKey[l] == 1)
        {
            poorRecord = record2.recordid;
            if(newMach)
            {
                ableMessage = true;
                messageBox(numberOfop++ + ')' + " add " + metadata[l] +"(k"+(l+1)+")" +"  to " + poorRecord);
                if(poorRecord == record2.recordid)
                    messageBox(metadata[l] +" is: " + record1[3]);
                else
                    messageBox(metadata[l] +" is: " + record2[3]);
                    messageBox("AND");
                      if(machKey[k] == 1)
        {
            poorRecord = record2.recordid;
            if(newMach)
            {
                ableMessage = true;
                messageBox("add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                if(poorRecord == record2.recordid)
                    messageBox(metadata[k] +" is: " + record1[3]);
                else
                    messageBox(metadata[k] +" is: " + record2[3]);

                messageBox("");
            }


        }

    if(machKey[k] == 2){
            poorRecord = record1.recordid;
        if(newMach)
            {
                ableMessage = true;
                messageBox( "add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                if(poorRecord == record1.recordid)
                    messageBox(metadata[k] +" is: " + record2[3]);
                else
                    messageBox(metadata[k] +" is: " + record1[3]);

                messageBox("");
            }
        }
        if(machKey[k] == 4){
         ableMessage = true;
         messageBox("change the " + metadata[k] +"(k"+(k+1)+")" +" in one of the records");
         messageBox("======= >              < =======")
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record1.recordid+": " + record1[k+1]);
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record2.recordid+": " + record2[k+1]);
        }
                }
            }
if(machKey[l] == 2){
            poorRecord = record1.recordid;
            if(newMach)
                {
                    ableMessage = true;
                    messageBox(numberOfop++ + ')' + " add " + metadata[l] +"(k"+(l+1)+")" +"  to " + poorRecord);
                    if(poorRecord == record1.recordid)
                        messageBox(metadata[l] +" is: " + record2[3]);
                    else
                        messageBox(metadata[l] +" is: " + record1[3]);
                    messageBox("AND");
                                   if(machKey[k] == 1)
        {
            poorRecord = record2.recordid;
            if(newMach)
            {
                ableMessage = true;
                messageBox("add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                if(poorRecord == record2.recordid)
                    messageBox(metadata[k] +" is: " + record1[3]);
                else
                    messageBox(metadata[k] +" is: " + record2[3]);

                messageBox("");
            }


        }

    if(machKey[k] == 2){
            poorRecord = record1.recordid;
        if(newMach)
            {
                ableMessage = true;
                messageBox( "add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                if(poorRecord == record1.recordid)
                    messageBox(metadata[k] +" is: " + record2[3]);
                else
                    messageBox(metadata[k] +" is: " + record1[3]);

                messageBox("");
            }
        }
        if(machKey[k] == 4){
         ableMessage = true;
         messageBox("change the " + metadata[k] +"(k"+(k+1)+")" +" in one of the records");
         messageBox("======= >              < =======")
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record1.recordid+": " + record1[k+1]);
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record2.recordid+": " + record2[k+1]);
        }
                }
        }

if(machKey[l] == 4){
         ableMessage = true;
         messageBox(numberOfop++ + ')' + " change the " + metadata[l] +"(k"+(l+1)+")" +" in one of the records");
         messageBox("======= >              < =======")
         messageBox(metadata[l] +"(k"+(l+1)+") at " + record1.recordid+": " + record1[l+1]);
         messageBox(metadata[l] +"(k"+(l+1)+") at " + record2.recordid+": " + record2[l+1]);

                       messageBox("AND");
                                   if(machKey[k] == 1)
        {
            poorRecord = record2.recordid;
            if(newMach)
            {
                ableMessage = true;
                messageBox("add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                if(poorRecord == record2.recordid)
                    messageBox(metadata[k] +" is: " + record1[3]);
                else
                    messageBox(metadata[k] +" is: " + record2[3]);

                messageBox("");
            }


        }

    if(machKey[k] == 2){
            poorRecord = record1.recordid;
        if(newMach)
            {
                ableMessage = true;
                messageBox( "add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                if(poorRecord == record1.recordid)
                    messageBox(metadata[k] +" is: " + record2[3]);
                else
                    messageBox(metadata[k] +" is: " + record1[3]);

                messageBox("");
            }
        }
        if(machKey[k] == 4){
         ableMessage = true;
         messageBox("change the " + metadata[k] +"(k"+(k+1)+")" +" in one of the records");
         messageBox("======= >              < =======")
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record1.recordid+": " + record1[k+1]);
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record2.recordid+": " + record2[k+1]);
        }
        }

        return newMach;
    }
}
function matchSuggestForT3(matchKeys){

       lockSummay = true;
   messageBox("")
   messageBox('Matching offers:')
   messageBox("")
  // console.log("######## Enter matchSuggestForT2")
   var firstOption = true;


/*
    0 - no record has key
    1 - only record 1 has key
    2 - only record 2 has key
    3 - both have same key
    4 - both have keys, but not same
*/
    var machKey = new Array(14);
    for (var i = 0; i < machKey.length; ++i) {
       if(comb[i] == true)
           {
           machKey[i] = 3;
           continue;
           }
       if(key1[i] == 0 && key2[i] == 0)
           {
           machKey[i] = 0;
           continue;
           }
       else if(key1[i]!= 0 && key2[i] == 0)
           {
               machKey[i] = 1;
               continue;
           }
       else if(key1[i] == 0 && key2[i]!=0)
           {
               machKey[i] = 2;
               continue;
           }
        else if(key1[i]!= key2[i] && key1[i]!=0 && key2[i]!=0)
            machKey[i] = 4;
}

    ableMessage = false;
    var isAmatchBy = false;
    var numberOfop = 1;
    var poorRecord = record2.recordid;
    for (i = 0; i < comb.length; i++){
        if(key1[i] == key2[i] && key1[i]!= '0')
            comb[i] = true;

   /*
    0 - no record has key
    1 - only record 1 has key
    2 - only record 2 has key
    3 - both have same key
    4 - both have keys, but not same
*/
}
   /* give DOI prioraty*/

    for (i = 0; i < comb.length; i++){
        if(comb[i] == false) // key is missing with atleast one
            isAmatchBy = completeTagOneKey(i)

    if(isAmatchBy == true)
        {

            ableMessage = true;
            completeTagOneKey(i);
            ableMessage = false;
            isAmatchBy = false;
        }
    }
/*    var j = 0;
    for (i = 0; i < comb.length; i++){
        if(comb[j] == false && comb[i] == false) // key is missing with atleast one
            isAmatchBy = completeTagTwoKey(j,i);

    if(isAmatchBy == true)
        {

            ableMessage = true;
            isAmatchBy = completeTagTwoKey(j,i);
            ableMessage = false;
            isAmatchBy = false;
        }
        if(i == comb.length -1 && j<comb.length)
            {
                i = 0;
                j +=1;
            }
    }*/


    function completeTagOneKey(k)
    {
        comb[k] = true;
        var newMach = checkType3Combinations();
        comb[k] = false;

        if(!ableMessage)
                return newMach;


        if(machKey[k] == 0)
            {
             messageBox(numberOfop++ + ')' + " add " + metadata[k]+"(k"+(k+1)+")" + " to both records");
             messageBox("");

            }
        if(machKey[k] == 1)
            {
                poorRecord = record2.recordid;
                if(newMach)
                {
                    ableMessage = true;
                    messageBox(numberOfop++ + ')' + " add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                    if(poorRecord == record2.recordid)
                        messageBox(metadata[k] +" is: " + record1[3]);
                    else
                        messageBox(metadata[k] +" is: " + record2[3]);

                    messageBox("");
                }


            }

        if(machKey[k] == 2){
                poorRecord = record1.recordid;
            if(newMach)
                {
                    ableMessage = true;
                    messageBox(numberOfop++ + ')' + " add " + metadata[k] +"(k"+(k+1)+")" +"  to " + poorRecord);
                    if(poorRecord == record1.recordid)
                        messageBox(metadata[k] +" is: " + record2[3]);
                    else
                        messageBox(metadata[k] +" is: " + record1[3]);

                    messageBox("");
                }
        }
        if(machKey[k] == 4){
         ableMessage = true;
         messageBox(numberOfop++ + ')' + " change the " + metadata[k] +"(k"+(k+1)+")" +" in one of the records");
         messageBox("======= >              < =======")
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record1.recordid+": " + record1[k+1]);
         messageBox(metadata[k] +"(k"+(k+1)+") at " + record2.recordid+": " + record2[k+1]);
         messageBox("");
        }

        return newMach;
    }

}

});

document.querySelector('.btn-reset').addEventListener('click', function() {

   document.querySelector('.insert-pnx1').value = '';
   document.querySelector('.insert-pnx2').value = '';

    $('.message-box').text("");
    $('.message-box').css('height', 120+'px');
    $('.message-box').css('top', 430+'px');
    $('.wrapper').css('height', 100 +'vh');
    $('body').css('height', $('.wrapper').height());
    $('.player-0-panel').text("Record 1");
    $('.player-1-panel').text("Record 2");
    record1 = '';
    record2 = '';
    PNX1 ='';
    PNX2 = '';
    key1 = '';
    key2 = '';
    key2 = '';

});

document.querySelector('.btn-copy').addEventListener('click', function() {
    $('.message-box').text("");
    $('.message-box').css('height', 120+'px');
    $('.message-box').css('top', 430+'px');
    $('.wrapper').css('height', 100 +'vh');
    $('body').css('height', $('.wrapper').height());
    $('.player-0-panel').text("Record 1");
    $('.player-1-panel').text("Record 2");
    record1 = '';
    record2 = '';
    PNX1 ='';
    PNX2 = '';
    key1 = '';
    key2 = '';
    key2 = '';


});

