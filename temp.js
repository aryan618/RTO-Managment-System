
function insertRecord() {
    
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'rto1'
    });

    var name = document.getElementById('name');
    var address = document.getElementById('address');

    console.log(name + ' ' + address);

    if(name.length != 0 && address.length != 0) {

        connection.connect(function (err) {
            if(err) throw err;
            console.log('Connected!');

            var sql = "INSERT INTO customers values(" +"\""+ name  +"\"" + ","+ "\"" + address +"\"" + ");";

            connection.query(sql, function(err, result) {
                if(err) throw err;
                console.log('1 row inserted!');
            });
        
        });

    }

}

const submitBtn = document.getElementById('submit');

submitBtn.addEventListener("click", insertRecord);
