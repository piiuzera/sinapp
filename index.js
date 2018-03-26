var Routes = require('./Routes');
var PointsJob = require('./jobs/PointsJob');
var StudentJob = require('./jobs/StudentJob');

Routes.app.set('port', (process.env.PORT || 5000));

Routes.app.listen(Routes.app.get('port'), function() {
	PointsJob.start();
	StudentJob.start();
	
	console.log('Server has started!');
});