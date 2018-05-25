Rails.application.routes.draw do
  root to: proc { [404, {}, []] }

  post 'user/login'

  resources :logs, only: [:index, :create]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
