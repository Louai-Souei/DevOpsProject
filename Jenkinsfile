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
                                                sh '/var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/sonar/bin/sonar-scanner -Dsonar.projectKey=devops_project'
                            }
                        }
                         }

                    }
                }


          stage('Build Images') {
                    steps {
                        script {
                            sh 'docker compose up -d'
                        }
                    }
                }
       }
      }
