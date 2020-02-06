function readTodo(token) {
    $.ajax('http://localhost:3000/todos', {
        method: "GET",
        headers: {
            token: token || localStorage.getItem('token')
        }
    })
        .done(({ data }) => {
            console.log(data, 'READDD TODOOOOOOO')
            // e.preventDefault()
            // console.log(data[0].due_date.getFullYear())
            // style="text-decoration: line-through red
            $('#todos').empty()
            for (let i = 0; i < data.length; i++) {
                const a = new Date(data[i].due_date)
                const year = a.getFullYear()
                const month = switchMonth(a.getMonth())
                const date = a.getDay()
                $('#todos').append(`
                <tr>
                    <td>${i + 1}</td>
                    <td>${data[i].title}</td>
                    <td>${data[i].description}</td>
                    <td>${date}  ${month} ${year}</td>
                    <td>
                        <button type="button" class="btn btn-danger" id="delete" onClick="destroy(${data[i].id})" value="${data[i].id}">Delete</button>
                        <button type="button" class="btn btn-warning" id="edit" onClick="edit(${data[i].id})" value="${data[i].id}">Edit</button>
                        <button type="button" class="btn btn-success" id="done" onClick="done(${data[i].id})" value="${data[i].id}">Done Todos</button>
                    </td>
                </tr>
                `)
            }
        })
        .fail(err => {
            console.log(err)
        })
}

function switchMonth(val) {
    switch (val) {
        case 0:
            return 'Januari'
        case 1:
            return 'Februari'
        case 2:
            return 'Maret'
        case 3:
            return 'April'
        case 4:
            return 'Mei'
        case 5:
            return 'Juni'
        case 6:
            return 'Juli'
        case 7:
            return 'Agustus'
        case 8:
            return 'September'
        case 8:
            return 'Oktober'
        case 10:
            return 'November'
        case 11:
            return 'Desember'
    }
}

function signIn() {
    const email = $('#emailIn').val()
    const password = $('#passwordIn').val()
    $.ajax('http://localhost:3000/login', {
        method: 'POST',
        data: {
            email, password
        }
    })
        .done(data => {
            console.log(data)
            localStorage.setItem('token', data.token)
            $('#signIn').hide()
            $('#getSignIn').hide()
            $('#getSignUp').hide()
            $('#getLogOut').show()
            $('#landing-page').hide()
            readTodo()
            $('#user-home').show()
        })
        .fail(err => {
            console.log(err)
        })
}

function signUp() {
    const email = $('#emailReg').val()
    const password = $('#passwordReg').val()
    // console.log(email, password)
    $.ajax('http://localhost:3000/register', {
        method: 'POST',
        data: {
            email, password
        }
    })
        .done(() => {
            $('#signIn').show()
            console.log('success register')
        })
        .fail(err => {
            console.log(err)
            console.log('failed register')
        })
}

function addTodo(e) {
    const title = $('#title-add').val()
    const description = $('#description-add').val()
    const due_date = $('#date-add').val()
    // console.log(title, description, due_date)
    $.ajax('http://localhost:3000/todos', {
        method: 'POST',
        data: {
            title, description, due_date
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(data => {
            e.preventDefault()
            readTodo()
            $('#user-home').show()
            $('#form-add-todo').hide()
            // console.log(data)
        })
        .fail(err => {
            console.log(err)
        })
}

function home() {
    if (localStorage.token) {
        $('#user-home').show()
        $('#getSignIn').hide()
        $('#getSignUp').hide()
        $('#getLogOut').show()
        $('#signUp').hide()
        $('#signIn').hide()
        $('#landing-page').hide()
        $('#delete-oy').hide()
        $('#form-add-todo').hide()
        $('#form-edit-todo').hide()
        readTodo()
    } else {
        $('#landing-page').show()
        $('#signUp').hide()
        $('#signIn').hide()
        $('#user-home').hide()
        $('#getLogOut').hide()
        $('#form-add-todo').hide()
        $('#delete-oy').hide()
        $('#form-edit-todo').hide()
    }
}

function destroy(id) {
    $.ajax({
        method: 'DELETE',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(data => {
            readTodo()
            console.log('sukses')
        })
        .fail(err => {
            console.log(err)
        })
}

function edit(id) {
    localStorage.setItem('id', id)
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(({data}) => {
            $("#form-edit-todo").show()
            $("#user-home").hide()
            $('#title-edit').val(`${data.title}`)
            $('#description-edit').val(`${data.description}`)
            console.log(data)
        })
        .fail(err => {
            console.log(err)
        })

}

function editTodo(e) {
    // console.log(updateId)
    const id = localStorage.getItem('id')
    const title = $('#title-edit').val()
    const description = $('#description-edit').val()
    const due_date = $('#date-edit').val()
    // console.log(title, description, due_date)
    $.ajax(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        data: {
            title, description, due_date
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(data => {
            e.preventDefault()
            readTodo()
            $('#user-home').show()
            $('#form-edit-todo').hide()
            // console.log(data)
        })
        .fail(err => {
            console.log(err)
        })
}


$(document).ready(() => {
    home()
    $('#getHome').on('click', () => {
        home()
    })

    $('#getSignIn').on('click', function () {
        $('#signUp').hide()
        $('#signIn').show()
        $('#user-home').hide()
    })

    $('#getSignUp').on('click', function () {
        $('#signIn').hide()
        $('#signUp').show()
        $('#user-home').hide()
    })

    $('#signUp').on('submit', () => {
        signUp()
    })

    $('#signIn').on('submit', () => {
        signIn()
    })

    $('#getLogOut').on('click', () => {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
            localStorage.clear()
            $('#landing-page').show()
            $('#getSignUp').show()
            $('#getSignIn').show()
            $('#signUp').hide()
            $('#signIn').hide()
            $('#user-home').hide()
            $('#getLogOut').hide()
            $('#form-add-todo').hide()
        });
    })

    $('#add-todo').on('click', () => {
        $('#user-home').hide()
        $('#form-add-todo').show()
    })

    $('#form-add-todo').on('submit', (e) => {
        addTodo(e)
    })

    $('#form-edit-todo').on('submit', (e) => {
        // console.log('TESSTTTTT')
        editTodo(e)
    })

})