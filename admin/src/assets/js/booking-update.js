$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  let userInfo = localStorage.getItem('userInfo');
  userInfo = JSON.parse(userInfo);
  let token = userInfo.token.token;

  $.ajax({
    url: `${HOST_NAME}/v1/admin/booking/${id}`,
    type: 'GET',
    dataType: 'json',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    success: function (booking) {
      $('#email').val(booking.users.email);
      $('#name').val(booking.name);
      $('#phone').val(booking.phone);
      $('#seat').val(booking.seat);
      $('#status').val(booking.status);
      $("#start_point").val(
        booking.buses.bus_stations_buses_start_pointTobus_stations.name
      );
      $("#end_point").val(
        booking.buses.bus_stations_buses_end_pointTobus_stations.name
      );
    },
    error: function (error) {
      console.log('error', error);
    },
  });

  $('#update-booking').submit(function (e) {
    e.preventDefault();
    const name = $('#name').val();
    const phone = $('#phone').val();
    const seat = $('#seat').val();
    const status = $('#status').val();
    $.ajax({
      url: `${HOST_NAME}/v1/admin/booking/${id}`,
      type: 'POST',
      dataType: 'json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: {
        name: name,
        phone: phone,
        seat: seat,
        status: status,
      },
      success: function (data) {
        window.location.href = `/pages/booking`;
      },
      error: function (error) {
        console.log('error', error);
      },
    });
  });
});
