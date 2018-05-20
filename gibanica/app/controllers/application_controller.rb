class ApplicationController < ActionController::Base
  protect_from_forgery # unless: -> { request.format.json? }

  # Overload handle_unverified_request to ensure that
  # exception is raised each time a request does not
  # pass validation.
  def handle_unverified_request
    byebug
    puts request.headers['Content-Type']
    puts request.headers['X-CSRF-Token']
    puts form_authenticity_token
    puts session[:_csrf_token]
    head :not_acceptable
  end
end
