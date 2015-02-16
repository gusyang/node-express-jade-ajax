/**
 * Created by gus on 15-2-13.
 */


// Userlist data array for filling in info box
var userListData = [];

//for jquery, after DOM ready
$(document).ready(function() {
    // get user list
    populateTable();

    // Username link click
    $('#userlist table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    // Add User button click
    $('#btnAddUser').on('click', addUser);
    //Delete user
    $('#userlist table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    $('#userlist table tbody').on('click', 'td a.linkupdateuser', getUserInfo);
    $('#btnUpdateUses').on('click',addUser);


});

// Functions =============================================================
// Fill table with data
function populateTable() {
    // Empty content string
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id +'">update</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userlist table tbody').html(tableContent);
    });
};

function showUserInfo(event){
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) {return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location)
};
// Add User
function addUser(event) {
    event.preventDefault();
    // basic validation - increase errorCount variable if any fields are blank
    var errorMsg = '',inputvalue,inputid;
    $('#addUser input').each(function(index, val) {
        inputvalue = $(this).val();
        inputid=$(this).attr('id');
        if(inputvalue === '') {
            errorMsg += "\nPlease input "+$(this).attr('placeholder');
        }
        //check email
        //console.log($(this).attr('id')==='inputUserEmail');
        if(inputid === 'inputUserEmail' && !isEmail(inputvalue)){
            errorMsg += 'Invalid Email!'
        }
    });

    //if exist _id, update user
    var _id = $('#hdid').val();
    var posturl = _id==='0'?'/users/adduser':'/users/updateuser/'+_id;
    // Check if have errors
    if(errorMsg === '') {
        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url:  posturl ,
            dataType: 'JSON'
        }).done(function( response ) {
            // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#addUser fieldset input').val('');

                $('#btnAddUser').css('display','block');
                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If has error
        alert(errorMsg);
        return false;
    }
};

// Delete User link click
function deleteUser(event) {
    event.preventDefault();
    var isConfirm = confirm('Are you sure to delete this user?');
    //confirm to delete
    if(isConfirm === true){
        $.ajax({
            type:'DELETE',
            url:'/users/deleteuser/' + $(this).attr('rel')
        }).done(function(res){
            if(res.msg === ''){}else{
                alert('Error:'+res.msg);
            }

            //update table
            populateTable();
        });
    }else{
        return false; //doesnt confirm to delete
    }
};

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
};

function getUserInfo(event){
    event.preventDefault();
    //hidden add user
    $('#btnAddUser').css('display','none');
    var id = $(this).attr('rel');
    var arPosition = userListData.map(function(Item) {return Item._id; }).indexOf(id);
    var data = userListData[arPosition];
    $('#inputUserName').val(data.username) ;
    $('#inputUserEmail').val(data.email);
    $('#inputUserFullname').val(data.fullname);
    $('#inputUserAge').val(data.age);
    $('#inputUserLocation').val(data.location);
    $('#inputUserGender').val(data.gender);
    $('#hdid').val(id);
};

