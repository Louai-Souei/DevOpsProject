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

        stage('SonarQube analysis') {
                    steps {

                    dir('server') {
                          script {
                            def scannerHome = tool name: 'sonar'
                            withSonarQubeEnv('sonarQube') {
                                sh "${scannerHome}\\bin\\sonar-scanner -Dsonar.projectKey=devops_project"
                            }
                        }
                         }

                    }
                }


//           stage('Build Images') {
//                     steps {
//                         script {
//                             sh 'docker-compose up --build'
//                         }
//                     }
//                 }
//       }
      }
