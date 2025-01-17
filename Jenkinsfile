pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                 dir('server') {
                    sh 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
            dir('server') {
                sh 'npm test'

                 }
            }
        }
          stage('Build Images') {
                    steps {
                        script {
                            sh 'docker-compose up --build'
                        }
                    }
                }
      }
      }
