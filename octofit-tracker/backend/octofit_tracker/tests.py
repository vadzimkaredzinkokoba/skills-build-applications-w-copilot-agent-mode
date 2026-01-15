from django.test import TestCase
from octofit_tracker.models import Team, User, Activity, Workout, Leaderboard
from datetime import date

class ModelSmokeTest(TestCase):
    def test_team_create(self):
        t = Team.objects.create(name='test team')
        self.assertEqual(str(t), 'test team')

    def test_user_create(self):
        t = Team.objects.create(name='testers')
        u = User.objects.create(name='Test User', email='test@example.com', team=t)
        self.assertEqual(str(u), 'Test User')

    def test_activity_create(self):
        t = Team.objects.create(name='testers')
        u = User.objects.create(name='Test User', email='test2@example.com', team=t)
        a = Activity.objects.create(user=u, type='Run', duration=10, date=date.today())
        self.assertEqual(a.type, 'Run')

    def test_workout_create(self):
        w = Workout.objects.create(name='Test Workout', description='desc', suggested_for='all')
        self.assertEqual(w.name, 'Test Workout')

    def test_leaderboard_create(self):
        t = Team.objects.create(name='testers')
        u = User.objects.create(name='Test User', email='test3@example.com', team=t)
        l = Leaderboard.objects.create(user=u, score=42)
        self.assertEqual(l.score, 42)
